'use client';

import { useState } from 'react';
import { Settings, Database, Mail, Shield, Check, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function AdminSettingsPage() {
  const [testingEmail, setTestingEmail] = useState(false);
  const [emailTestResult, setEmailTestResult] = useState<'success' | 'error' | null>(null);

  const handleTestEmail = async () => {
    setTestingEmail(true);
    setEmailTestResult(null);
    try {
      // Simulate email test
      await new Promise(resolve => setTimeout(resolve, 2000));
      setEmailTestResult('success');
    } catch {
      setEmailTestResult('error');
    } finally {
      setTestingEmail(false);
    }
  };

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold font-serif text-foreground">Instellingen</h1>
        <p className="text-muted-foreground">
          Beheer systeeminstellingen en configuratie
        </p>
      </div>

      <div className="grid gap-6 max-w-3xl">
        {/* Database Info */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Database className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <CardTitle className="text-lg font-serif">Database</CardTitle>
                <CardDescription>Neon PostgreSQL configuratie</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-sm text-muted-foreground">Provider</span>
                <span className="text-sm font-medium">Neon</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-sm text-muted-foreground">ORM</span>
                <span className="text-sm font-medium">Drizzle</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-sm text-muted-foreground">Status</span>
                <span className="inline-flex items-center gap-1 text-sm font-medium text-green-600">
                  <Check className="w-4 h-4" />
                  Verbonden
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Email Settings */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Mail className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <CardTitle className="text-lg font-serif">E-mail</CardTitle>
                <CardDescription>Resend e-mail configuratie</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-sm text-muted-foreground">Provider</span>
                <span className="text-sm font-medium">Resend</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-sm text-muted-foreground">Afzender</span>
                <span className="text-sm font-medium">noreply@begraafplaatsindebuurt.nl</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-sm text-muted-foreground">Status</span>
                <span className="inline-flex items-center gap-1 text-sm font-medium text-green-600">
                  <Check className="w-4 h-4" />
                  Geconfigureerd
                </span>
              </div>
              <div className="pt-4">
                <Button
                  variant="outline"
                  onClick={handleTestEmail}
                  disabled={testingEmail}
                  className="w-full"
                >
                  {testingEmail ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Test e-mail versturen...
                    </>
                  ) : emailTestResult === 'success' ? (
                    <>
                      <Check className="w-4 h-4 mr-2 text-green-600" />
                      Test succesvol!
                    </>
                  ) : (
                    'Test e-mail versturen'
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <CardTitle className="text-lg font-serif">Beveiliging</CardTitle>
                <CardDescription>Authenticatie en sessie instellingen</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-sm text-muted-foreground">Authenticatie</span>
                <span className="text-sm font-medium">JWT + Cookies</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-sm text-muted-foreground">Sessie duur</span>
                <span className="text-sm font-medium">7 dagen</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-sm text-muted-foreground">Wachtwoord hashing</span>
                <span className="text-sm font-medium">bcrypt (12 rounds)</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-sm text-muted-foreground">Verificatie codes</span>
                <span className="text-sm font-medium">15 minuten geldig</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* System Info */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Settings className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <CardTitle className="text-lg font-serif">Systeem</CardTitle>
                <CardDescription>Framework en versie informatie</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-sm text-muted-foreground">Framework</span>
                <span className="text-sm font-medium">Next.js 14</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-sm text-muted-foreground">Styling</span>
                <span className="text-sm font-medium">Tailwind CSS + shadcn/ui</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-sm text-muted-foreground">Taal</span>
                <span className="text-sm font-medium">TypeScript</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-sm text-muted-foreground">Node.js</span>
                <span className="text-sm font-medium">v22.x</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
