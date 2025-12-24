'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  Search,
  MoreVertical,
  Trash2,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Eye,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface Claim {
  id: number;
  placeId: number;
  userId: number;
  status: string;
  verificationMethod: string | null;
  verificationEmail: string | null;
  businessRole: string | null;
  claimantName: string | null;
  claimantPhone: string | null;
  notes: string | null;
  adminNotes: string | null;
  rejectionReason: string | null;
  reviewedAt: string | null;
  createdAt: string;
  userName: string | null;
  userEmail: string | null;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export default function AdminClaimsPage() {
  const searchParams = useSearchParams();
  const [claims, setClaims] = useState<Claim[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [statusFilter, setStatusFilter] = useState(searchParams.get('status') || '');
  const [openMenu, setOpenMenu] = useState<number | null>(null);
  const [showDetails, setShowDetails] = useState<Claim | null>(null);
  const [showRejectModal, setShowRejectModal] = useState<number | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  const fetchClaims = async (page = 1) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set('page', page.toString());
      if (search) params.set('search', search);
      if (statusFilter) params.set('status', statusFilter);

      const response = await fetch(`/api/admin/claims?${params}`, {
        credentials: 'include',
      });
      if (response.ok) {
        const data = await response.json();
        setClaims(data.claims);
        setPagination(data.pagination);
      }
    } catch (error) {
      console.error('Error fetching claims:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClaims();
  }, [search, statusFilter]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchClaims(1);
  };

  const handleApprove = async (claimId: number) => {
    setActionLoading(true);
    try {
      const response = await fetch(`/api/admin/claims/${claimId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ status: 'approved' }),
      });

      if (response.ok) {
        setClaims(claims.map(c =>
          c.id === claimId ? { ...c, status: 'approved', reviewedAt: new Date().toISOString() } : c
        ));
      }
    } catch (error) {
      console.error('Error approving claim:', error);
    } finally {
      setActionLoading(false);
      setOpenMenu(null);
    }
  };

  const handleReject = async () => {
    if (!showRejectModal || !rejectionReason.trim()) return;
    setActionLoading(true);
    try {
      const response = await fetch(`/api/admin/claims/${showRejectModal}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ status: 'rejected', rejectionReason }),
      });

      if (response.ok) {
        setClaims(claims.map(c =>
          c.id === showRejectModal
            ? { ...c, status: 'rejected', rejectionReason, reviewedAt: new Date().toISOString() }
            : c
        ));
      }
    } catch (error) {
      console.error('Error rejecting claim:', error);
    } finally {
      setActionLoading(false);
      setShowRejectModal(null);
      setRejectionReason('');
    }
  };

  const handleDelete = async (claimId: number) => {
    if (!confirm('Weet je zeker dat je deze claim wilt verwijderen?')) return;
    try {
      const response = await fetch(`/api/admin/claims/${claimId}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (response.ok) {
        setClaims(claims.filter(c => c.id !== claimId));
        if (pagination) {
          setPagination({ ...pagination, total: pagination.total - 1 });
        }
      }
    } catch (error) {
      console.error('Error deleting claim:', error);
    }
    setOpenMenu(null);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
            <CheckCircle className="w-3 h-3" />
            Goedgekeurd
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">
            <Clock className="w-3 h-3" />
            In afwachting
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
            <AlertCircle className="w-3 h-3" />
            Afgewezen
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold font-serif text-foreground">Claims</h1>
        <p className="text-muted-foreground">
          Bekijk en beheer begraafplaats claims ({pagination?.total || 0} totaal)
        </p>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Zoek op begraafplaats naam..."
                className="pl-10"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-10 px-3 rounded-md border border-input bg-background text-sm"
            >
              <option value="">Alle statussen</option>
              <option value="pending">In afwachting</option>
              <option value="approved">Goedgekeurd</option>
              <option value="rejected">Afgewezen</option>
            </select>
            <Button type="submit">Zoeken</Button>
          </form>
        </CardContent>
      </Card>

      {/* Claims Table */}
      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-12 flex justify-center">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : claims.length === 0 ? (
            <div className="p-12 text-center text-muted-foreground">
              Geen claims gevonden
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="text-left p-4 text-sm font-medium">Claim</th>
                    <th className="text-left p-4 text-sm font-medium hidden md:table-cell">Aanvrager</th>
                    <th className="text-left p-4 text-sm font-medium">Status</th>
                    <th className="text-left p-4 text-sm font-medium hidden sm:table-cell">Ingediend</th>
                    <th className="text-right p-4 text-sm font-medium">Acties</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {claims.map((claim) => (
                    <tr key={claim.id} className="hover:bg-muted/30 transition-colors">
                      <td className="p-4">
                        <div>
                          <p className="font-medium line-clamp-1">
                            {claim.claimantName || claim.userName || `Claim #${claim.id}`}
                          </p>
                          <p className="text-xs text-muted-foreground">{claim.businessRole || 'Beheerder'}</p>
                        </div>
                      </td>
                      <td className="p-4 hidden md:table-cell">
                        <div>
                          <p className="text-sm">{claim.userName}</p>
                          <p className="text-xs text-muted-foreground">{claim.userEmail}</p>
                        </div>
                      </td>
                      <td className="p-4">
                        {getStatusBadge(claim.status)}
                      </td>
                      <td className="p-4 hidden sm:table-cell">
                        <span className="text-sm text-muted-foreground">
                          {new Date(claim.createdAt).toLocaleDateString('nl-NL')}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <div className="relative inline-block">
                          <button
                            onClick={() => setOpenMenu(openMenu === claim.id ? null : claim.id)}
                            className="p-2 hover:bg-muted rounded-lg transition-colors"
                          >
                            <MoreVertical className="w-4 h-4" />
                          </button>

                          {openMenu === claim.id && (
                            <>
                              <div
                                className="fixed inset-0 z-10"
                                onClick={() => setOpenMenu(null)}
                              />
                              <div className="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-lg border py-1 z-20">
                                <button
                                  onClick={() => {
                                    setShowDetails(claim);
                                    setOpenMenu(null);
                                  }}
                                  className="w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-muted transition-colors"
                                >
                                  <Eye className="w-4 h-4" />
                                  Details bekijken
                                </button>
                                {claim.status === 'pending' && (
                                  <>
                                    <button
                                      onClick={() => handleApprove(claim.id)}
                                      disabled={actionLoading}
                                      className="w-full flex items-center gap-2 px-4 py-2 text-sm text-green-600 hover:bg-green-50 transition-colors"
                                    >
                                      <CheckCircle className="w-4 h-4" />
                                      Goedkeuren
                                    </button>
                                    <button
                                      onClick={() => {
                                        setShowRejectModal(claim.id);
                                        setOpenMenu(null);
                                      }}
                                      className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                                    >
                                      <XCircle className="w-4 h-4" />
                                      Afwijzen
                                    </button>
                                  </>
                                )}
                                <button
                                  onClick={() => handleDelete(claim.id)}
                                  className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                                >
                                  <Trash2 className="w-4 h-4" />
                                  Verwijderen
                                </button>
                              </div>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div className="p-4 border-t flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                Pagina {pagination.page} van {pagination.totalPages}
              </span>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={pagination.page === 1}
                  onClick={() => fetchClaims(pagination.page - 1)}
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={pagination.page === pagination.totalPages}
                  onClick={() => fetchClaims(pagination.page + 1)}
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Details Modal */}
      {showDetails && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <Card className="w-full max-w-lg my-8">
            <CardHeader>
              <CardTitle className="text-lg font-serif">Claim Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Claimant</p>
                  <p className="font-medium">{showDetails.claimantName || showDetails.userName || '-'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <div className="mt-1">{getStatusBadge(showDetails.status)}</div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Account</p>
                  <p className="font-medium">{showDetails.userName}</p>
                  <p className="text-sm text-muted-foreground">{showDetails.userEmail}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Functie</p>
                  <p className="font-medium">{showDetails.businessRole || '-'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Telefoon</p>
                  <p className="font-medium">{showDetails.claimantPhone || '-'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Verificatie</p>
                  <p className="font-medium">{showDetails.verificationMethod || '-'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Ingediend</p>
                  <p className="font-medium">
                    {new Date(showDetails.createdAt).toLocaleDateString('nl-NL', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Place ID</p>
                  <p className="font-medium">{showDetails.placeId}</p>
                </div>
              </div>

              {showDetails.notes && (
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Notities</p>
                  <p className="text-sm bg-muted/50 p-3 rounded-lg whitespace-pre-wrap">{showDetails.notes}</p>
                </div>
              )}

              {showDetails.adminNotes && (
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Admin notities</p>
                  <p className="text-sm bg-blue-50 text-blue-700 p-3 rounded-lg">{showDetails.adminNotes}</p>
                </div>
              )}

              {showDetails.rejectionReason && (
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Afwijzingsreden</p>
                  <p className="text-sm bg-red-50 text-red-700 p-3 rounded-lg">{showDetails.rejectionReason}</p>
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setShowDetails(null)}
                  className="flex-1"
                >
                  Sluiten
                </Button>
                {showDetails.status === 'pending' && (
                  <Button
                    onClick={() => {
                      handleApprove(showDetails.id);
                      setShowDetails(null);
                    }}
                    className="flex-1 bg-green-600 hover:bg-green-700"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Goedkeuren
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="text-lg font-serif">Claim afwijzen</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Reden voor afwijzing *
                  </label>
                  <textarea
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    className="w-full h-32 px-3 py-2 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Leg uit waarom deze claim wordt afgewezen..."
                    required
                  />
                </div>
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowRejectModal(null);
                      setRejectionReason('');
                    }}
                    className="flex-1"
                    disabled={actionLoading}
                  >
                    Annuleren
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={handleReject}
                    className="flex-1"
                    disabled={!rejectionReason.trim() || actionLoading}
                  >
                    {actionLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      'Afwijzen'
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
