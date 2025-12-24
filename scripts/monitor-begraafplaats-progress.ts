import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: path.join(process.cwd(), '.env.local') });

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

interface ProgressStats {
  total_records: number;
  pending: number;
  scraping: number;
  completed: number;
  failed: number;
  enrichment_failed: number;
  enriched: number;
  completion_rate: number;
  enrichment_rate: number;
  avg_processing_time?: number;
  errors: ErrorSummary[];
}

interface ErrorSummary {
  error_type: string;
  count: number;
  examples: string[];
}

interface DetailedRecord {
  begraafplaats_slug: string;
  begraafplaats_naam: string;
  gemeente: string;
  provincie: string;
  scrape_status: string;
  website_url?: string;
  website_scraped_at?: string;
  google_scraped_at?: string;
  generated_at?: string;
  last_error?: string;
  created_at: string;
  updated_at: string;
}

// Function to calculate processing time
function calculateProcessingTime(created: string, updated: string): number {
  const createdDate = new Date(created);
  const updatedDate = new Date(updated);
  return (updatedDate.getTime() - createdDate.getTime()) / (1000 * 60); // minutes
}

// Function to generate progress report
async function generateProgressReport(): Promise<ProgressStats> {
  console.log('📊 Generating progress report...\n');

  // Get all records
  const { data: allRecords, error } = await supabase
    .from('scraped_begraafplaats_data')
    .select('*')
    .order('created_at');

  if (error) {
    throw new Error(`Failed to fetch records: ${error.message}`);
  }

  if (!allRecords || allRecords.length === 0) {
    console.log('📭 No records found in database');
    return {
      total_records: 0,
      pending: 0,
      scraping: 0,
      completed: 0,
      failed: 0,
      enrichment_failed: 0,
      enriched: 0,
      completion_rate: 0,
      enrichment_rate: 0,
      errors: []
    };
  }

  // Calculate statistics
  const stats = {
    total_records: allRecords.length,
    pending: 0,
    scraping: 0,
    completed: 0,
    failed: 0,
    enrichment_failed: 0,
    enriched: 0,
    completion_rate: 0,
    enrichment_rate: 0,
    errors: [] as ErrorSummary[]
  };

  const errors: { [key: string]: string[] } = {};
  const processingTimes: number[] = [];

  allRecords.forEach((record: DetailedRecord) => {
    // Count by status
    switch (record.scrape_status) {
      case 'pending':
        stats.pending++;
        break;
      case 'scraping':
        stats.scraping++;
        break;
      case 'completed':
        stats.completed++;
        break;
      case 'failed':
        stats.failed++;
        break;
      case 'enrichment_failed':
        stats.enrichment_failed++;
        break;
    }

    // Count enriched records
    if (record.generated_at) {
      stats.enriched++;
    }

    // Collect errors
    if (record.last_error) {
      const errorType = record.last_error.split(':')[0] || 'Unknown';
      if (!errors[errorType]) errors[errorType] = [];
      errors[errorType].push(`${record.begraafplaats_naam}: ${record.last_error}`);
    }

    // Calculate processing times for completed records
    if (record.scrape_status === 'completed' && record.updated_at !== record.created_at) {
      const processingTime = calculateProcessingTime(record.created_at, record.updated_at);
      processingTimes.push(processingTime);
    }
  });

  // Calculate rates
  stats.completion_rate = stats.total_records > 0 ? 
    ((stats.completed + stats.enriched) / stats.total_records) * 100 : 0;
  
  stats.enrichment_rate = stats.total_records > 0 ? 
    (stats.enriched / stats.total_records) * 100 : 0;

  // Calculate average processing time
  if (processingTimes.length > 0) {
    stats.avg_processing_time = processingTimes.reduce((a, b) => a + b, 0) / processingTimes.length;
  }

  // Prepare error summary
  stats.errors = Object.entries(errors).map(([errorType, examples]) => ({
    error_type: errorType,
    count: examples.length,
    examples: examples.slice(0, 3) // First 3 examples
  }));

  return stats;
}

// Function to show detailed status by province/type
async function showDetailedBreakdown() {
  console.log('🔍 Detailed Breakdown by Province and Type\n');

  const { data: records, error } = await supabase
    .from('scraped_begraafplaats_data')
    .select('provincie, type, scrape_status, generated_at');

  if (error || !records) {
    console.error('Failed to fetch detailed breakdown');
    return;
  }

  // Group by province
  const byProvince: { [key: string]: any } = {};
  const byType: { [key: string]: any } = {};

  records.forEach(record => {
    const province = record.provincie || 'Onbekend';
    const type = record.type || 'Onbekend';

    // Initialize province stats
    if (!byProvince[province]) {
      byProvince[province] = { total: 0, completed: 0, enriched: 0 };
    }

    // Initialize type stats
    if (!byType[type]) {
      byType[type] = { total: 0, completed: 0, enriched: 0 };
    }

    // Count totals
    byProvince[province].total++;
    byType[type].total++;

    // Count completed
    if (record.scrape_status === 'completed' || record.generated_at) {
      byProvince[province].completed++;
      byType[type].completed++;
    }

    // Count enriched
    if (record.generated_at) {
      byProvince[province].enriched++;
      byType[type].enriched++;
    }
  });

  // Show province breakdown
  console.log('🏛️ Progress by Province:');
  console.log('─'.repeat(80));
  console.log('Province'.padEnd(20) + 'Total'.padEnd(8) + 'Completed'.padEnd(12) + 'Enriched'.padEnd(10) + 'Progress');
  console.log('─'.repeat(80));

  Object.entries(byProvince)
    .sort(([,a], [,b]) => (b as any).total - (a as any).total)
    .slice(0, 10)
    .forEach(([province, stats]) => {
      const s = stats as any;
      const progress = s.total > 0 ? ((s.enriched / s.total) * 100).toFixed(1) : '0.0';
      console.log(
        province.padEnd(20) + 
        s.total.toString().padEnd(8) + 
        s.completed.toString().padEnd(12) + 
        s.enriched.toString().padEnd(10) + 
        `${progress}%`
      );
    });

  console.log('\n📋 Progress by Type:');
  console.log('─'.repeat(60));
  console.log('Type'.padEnd(25) + 'Total'.padEnd(8) + 'Enriched'.padEnd(10) + 'Progress');
  console.log('─'.repeat(60));

  Object.entries(byType)
    .sort(([,a], [,b]) => (b as any).total - (a as any).total)
    .forEach(([type, stats]) => {
      const s = stats as any;
      const progress = s.total > 0 ? ((s.enriched / s.total) * 100).toFixed(1) : '0.0';
      console.log(
        type.padEnd(25) + 
        s.total.toString().padEnd(8) + 
        s.enriched.toString().padEnd(10) + 
        `${progress}%`
      );
    });
}

// Function to show recent activity
async function showRecentActivity(limit: number = 10) {
  console.log(`\n⏰ Recent Activity (Last ${limit} updates)\n`);

  const { data: recentRecords, error } = await supabase
    .from('scraped_begraafplaats_data')
    .select('begraafplaats_naam, gemeente, scrape_status, updated_at, last_error')
    .order('updated_at', { ascending: false })
    .limit(limit);

  if (error || !recentRecords) {
    console.error('Failed to fetch recent activity');
    return;
  }

  console.log('Time'.padEnd(20) + 'Name'.padEnd(30) + 'Location'.padEnd(20) + 'Status');
  console.log('─'.repeat(90));

  recentRecords.forEach(record => {
    const time = new Date(record.updated_at).toLocaleString();
    const name = record.begraafplaats_naam.slice(0, 28);
    const location = record.gemeente.slice(0, 18);
    const status = record.scrape_status === 'failed' && record.last_error ? 
      `❌ ${record.last_error.slice(0, 20)}...` : 
      getStatusEmoji(record.scrape_status) + ' ' + record.scrape_status;

    console.log(
      time.slice(0, 19).padEnd(20) +
      name.padEnd(30) +
      location.padEnd(20) +
      status
    );
  });
}

// Function to get status emoji
function getStatusEmoji(status: string): string {
  switch (status) {
    case 'pending': return '⏳';
    case 'scraping': return '🔄';
    case 'completed': return '✅';
    case 'failed': return '❌';
    case 'enrichment_failed': return '⚠️';
    default: return '❓';
  }
}

// Function to save progress report to file
async function saveProgressReport(stats: ProgressStats) {
  const report = {
    generated_at: new Date().toISOString(),
    stats,
    summary: {
      total_begraafplaatsen: stats.total_records,
      completion_percentage: stats.completion_rate.toFixed(1),
      enrichment_percentage: stats.enrichment_rate.toFixed(1),
      remaining_to_scrape: stats.pending + stats.scraping,
      remaining_to_enrich: stats.completed - stats.enriched,
      estimated_time_remaining: stats.avg_processing_time ? 
        ((stats.pending + stats.scraping) * stats.avg_processing_time).toFixed(1) + ' minutes' : 
        'Unknown'
    }
  };

  const reportsDir = path.join(process.cwd(), 'reports');
  if (!fs.existsSync(reportsDir)) {
    fs.mkdirSync(reportsDir, { recursive: true });
  }

  const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
  const reportPath = path.join(reportsDir, `begraafplaats-progress-${timestamp}.json`);
  
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  console.log(`\n💾 Progress report saved to: ${reportPath}`);
}

// Main monitoring function
async function monitorProgress() {
  console.log('🏛️ BEGRAAFPLAATS SCRAPING & ENRICHMENT MONITOR');
  console.log('===============================================\n');

  try {
    // Check if we have any data
    const { data: sampleData, error: sampleError } = await supabase
      .from('scraped_begraafplaats_data')
      .select('count')
      .limit(1);

    if (sampleError) {
      console.error('❌ Database connection failed:', sampleError.message);
      console.log('\nPlease ensure:');
      console.log('1. The scraped_begraafplaats_data table exists in Supabase');
      console.log('2. Your environment variables are set correctly');
      console.log('3. Run the scraping script first: npm run scrape-websites');
      return;
    }

    // Generate main progress report
    const stats = await generateProgressReport();

    // Display main statistics
    console.log('📊 OVERALL PROGRESS');
    console.log('==================\n');
    console.log(`📈 Total Begraafplaatsen: ${stats.total_records}`);
    console.log(`⏳ Pending: ${stats.pending}`);
    console.log(`🔄 Scraping: ${stats.scraping}`);
    console.log(`✅ Completed: ${stats.completed}`);
    console.log(`❌ Failed: ${stats.failed}`);
    console.log(`⚠️ Enrichment Failed: ${stats.enrichment_failed}`);
    console.log(`🤖 Enriched: ${stats.enriched}`);
    console.log(`\n📊 Completion Rate: ${stats.completion_rate.toFixed(1)}%`);
    console.log(`🎯 Enrichment Rate: ${stats.enrichment_rate.toFixed(1)}%`);

    if (stats.avg_processing_time) {
      console.log(`⏱️ Avg Processing Time: ${stats.avg_processing_time.toFixed(1)} minutes`);
    }

    // Show progress bar
    const progressWidth = 50;
    const completedWidth = Math.round((stats.completion_rate / 100) * progressWidth);
    const enrichedWidth = Math.round((stats.enrichment_rate / 100) * progressWidth);
    
    console.log('\n📊 Progress Visualization:');
    console.log('Completion: [' + '█'.repeat(completedWidth) + '░'.repeat(progressWidth - completedWidth) + '] ' + stats.completion_rate.toFixed(1) + '%');
    console.log('Enrichment: [' + '█'.repeat(enrichedWidth) + '░'.repeat(progressWidth - enrichedWidth) + '] ' + stats.enrichment_rate.toFixed(1) + '%');

    // Show errors if any
    if (stats.errors.length > 0) {
      console.log('\n🚨 ERROR SUMMARY');
      console.log('================\n');
      stats.errors.forEach(error => {
        console.log(`❌ ${error.error_type}: ${error.count} occurrences`);
        error.examples.forEach(example => {
          console.log(`   • ${example.slice(0, 80)}...`);
        });
        console.log('');
      });
    }

    // Show detailed breakdown
    await showDetailedBreakdown();

    // Show recent activity
    await showRecentActivity();

    // Recommendations
    console.log('\n💡 RECOMMENDATIONS');
    console.log('==================\n');

    if (stats.pending > 0) {
      console.log(`🔄 ${stats.pending} begraafplaatsen are pending scraping`);
      console.log('   → Run: npm run scrape-websites to continue scraping');
    }

    if (stats.completed > stats.enriched) {
      const toEnrich = stats.completed - stats.enriched;
      console.log(`🤖 ${toEnrich} scraped begraafplaatsen need content enrichment`);
      console.log('   → Run: npm run enrich-content to generate AI content');
    }

    if (stats.enriched > 0) {
      console.log(`📦 ${stats.enriched} begraafplaatsen have enriched content`);
      console.log('   → Run: npm run export-enriched to update production data');
    }

    if (stats.failed > 0) {
      console.log(`⚠️ ${stats.failed} begraafplaatsen failed scraping`);
      console.log('   → Review errors and retry manually if needed');
    }

    // Save report to file
    const shouldSave = process.argv.includes('--save') || stats.total_records > 100;
    if (shouldSave) {
      await saveProgressReport(stats);
    }

    // ETA calculation
    if (stats.avg_processing_time && (stats.pending + stats.scraping) > 0) {
      const remaining = stats.pending + stats.scraping;
      const etaMinutes = remaining * stats.avg_processing_time;
      const etaHours = etaMinutes / 60;
      
      console.log('\n⏰ ESTIMATED TIME TO COMPLETION');
      console.log('===============================');
      if (etaHours > 1) {
        console.log(`🕐 Estimated time: ${etaHours.toFixed(1)} hours`);
      } else {
        console.log(`🕐 Estimated time: ${etaMinutes.toFixed(0)} minutes`);
      }
    }

    console.log('\n✅ Monitoring complete!\n');

  } catch (error) {
    console.error('\n❌ Monitoring failed:', error);
    process.exit(1);
  }
}

// Show help
if (process.argv.includes('--help')) {
  console.log(`
🏛️ BEGRAAFPLAATS PROGRESS MONITOR
================================

Usage:
  npm run monitor-progress         # Show current progress
  npm run monitor-progress --save  # Save detailed report to file

This tool shows:
- Overall scraping and enrichment progress
- Error summary and troubleshooting
- Breakdown by province and type
- Recent activity log
- Recommendations for next steps
- ETA for completion

The monitor tracks the scraped_begraafplaats_data table and provides
real-time insights into the data pipeline progress.
`);
  process.exit(0);
}

// Run if called directly
if (require.main === module) {
  monitorProgress();
}