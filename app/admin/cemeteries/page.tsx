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
  MapPin,
  Eye,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface Cemetery {
  id: number;
  userId: number;
  naam: string;
  slug: string;
  type: string;
  adres: string | null;
  postcode: string | null;
  plaats: string;
  gemeente: string;
  provincie: string;
  status: string;
  rejectionReason: string | null;
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

export default function AdminCemeteriesPage() {
  const searchParams = useSearchParams();
  const [cemeteries, setCemeteries] = useState<Cemetery[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [statusFilter, setStatusFilter] = useState(searchParams.get('status') || '');
  const [openMenu, setOpenMenu] = useState<number | null>(null);
  const [showDetails, setShowDetails] = useState<Cemetery | null>(null);
  const [showRejectModal, setShowRejectModal] = useState<number | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  const fetchCemeteries = async (page = 1) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set('page', page.toString());
      if (search) params.set('search', search);
      if (statusFilter) params.set('status', statusFilter);

      const response = await fetch(`/api/admin/cemeteries?${params}`, {
        credentials: 'include',
      });
      if (response.ok) {
        const data = await response.json();
        setCemeteries(data.cemeteries);
        setPagination(data.pagination);
      }
    } catch (error) {
      console.error('Error fetching cemeteries:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCemeteries();
  }, [search, statusFilter]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchCemeteries(1);
  };

  const handleApprove = async (cemeteryId: number) => {
    setActionLoading(true);
    try {
      const response = await fetch(`/api/admin/cemeteries/${cemeteryId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ status: 'approved' }),
      });

      if (response.ok) {
        setCemeteries(cemeteries.map(c =>
          c.id === cemeteryId ? { ...c, status: 'approved' } : c
        ));
      }
    } catch (error) {
      console.error('Error approving cemetery:', error);
    } finally {
      setActionLoading(false);
      setOpenMenu(null);
    }
  };

  const handleReject = async () => {
    if (!showRejectModal || !rejectionReason.trim()) return;
    setActionLoading(true);
    try {
      const response = await fetch(`/api/admin/cemeteries/${showRejectModal}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ status: 'rejected', rejectionReason }),
      });

      if (response.ok) {
        setCemeteries(cemeteries.map(c =>
          c.id === showRejectModal
            ? { ...c, status: 'rejected', rejectionReason }
            : c
        ));
      }
    } catch (error) {
      console.error('Error rejecting cemetery:', error);
    } finally {
      setActionLoading(false);
      setShowRejectModal(null);
      setRejectionReason('');
    }
  };

  const handleDelete = async (cemeteryId: number) => {
    if (!confirm('Weet je zeker dat je deze begraafplaats wilt verwijderen?')) return;
    try {
      const response = await fetch(`/api/admin/cemeteries/${cemeteryId}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (response.ok) {
        setCemeteries(cemeteries.filter(c => c.id !== cemeteryId));
        if (pagination) {
          setPagination({ ...pagination, total: pagination.total - 1 });
        }
      }
    } catch (error) {
      console.error('Error deleting cemetery:', error);
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
        <h1 className="text-2xl font-bold font-serif text-foreground">Ingezonden Begraafplaatsen</h1>
        <p className="text-muted-foreground">
          Bekijk en keur door gebruikers ingezonden begraafplaatsen ({pagination?.total || 0} totaal)
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
                placeholder="Zoek op naam, gemeente of plaats..."
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

      {/* Cemeteries Table */}
      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-12 flex justify-center">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : cemeteries.length === 0 ? (
            <div className="p-12 text-center text-muted-foreground">
              Geen ingezonden begraafplaatsen gevonden
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="text-left p-4 text-sm font-medium">Begraafplaats</th>
                    <th className="text-left p-4 text-sm font-medium hidden md:table-cell">Locatie</th>
                    <th className="text-left p-4 text-sm font-medium hidden lg:table-cell">Ingezonden door</th>
                    <th className="text-left p-4 text-sm font-medium">Status</th>
                    <th className="text-right p-4 text-sm font-medium">Acties</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {cemeteries.map((cemetery) => (
                    <tr key={cemetery.id} className="hover:bg-muted/30 transition-colors">
                      <td className="p-4">
                        <div>
                          <p className="font-medium line-clamp-1">{cemetery.naam}</p>
                          <p className="text-xs text-muted-foreground capitalize">{cemetery.type}</p>
                        </div>
                      </td>
                      <td className="p-4 hidden md:table-cell">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <MapPin className="w-4 h-4" />
                          {cemetery.plaats}, {cemetery.provincie}
                        </div>
                      </td>
                      <td className="p-4 hidden lg:table-cell">
                        <div>
                          <p className="text-sm">{cemetery.userName}</p>
                          <p className="text-xs text-muted-foreground">{cemetery.userEmail}</p>
                        </div>
                      </td>
                      <td className="p-4">
                        {getStatusBadge(cemetery.status)}
                      </td>
                      <td className="p-4 text-right">
                        <div className="relative inline-block">
                          <button
                            onClick={() => setOpenMenu(openMenu === cemetery.id ? null : cemetery.id)}
                            className="p-2 hover:bg-muted rounded-lg transition-colors"
                          >
                            <MoreVertical className="w-4 h-4" />
                          </button>

                          {openMenu === cemetery.id && (
                            <>
                              <div
                                className="fixed inset-0 z-10"
                                onClick={() => setOpenMenu(null)}
                              />
                              <div className="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-lg border py-1 z-20">
                                <button
                                  onClick={() => {
                                    setShowDetails(cemetery);
                                    setOpenMenu(null);
                                  }}
                                  className="w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-muted transition-colors"
                                >
                                  <Eye className="w-4 h-4" />
                                  Details bekijken
                                </button>
                                {cemetery.status === 'pending' && (
                                  <>
                                    <button
                                      onClick={() => handleApprove(cemetery.id)}
                                      disabled={actionLoading}
                                      className="w-full flex items-center gap-2 px-4 py-2 text-sm text-green-600 hover:bg-green-50 transition-colors"
                                    >
                                      <CheckCircle className="w-4 h-4" />
                                      Goedkeuren
                                    </button>
                                    <button
                                      onClick={() => {
                                        setShowRejectModal(cemetery.id);
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
                                  onClick={() => handleDelete(cemetery.id)}
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
                  onClick={() => fetchCemeteries(pagination.page - 1)}
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={pagination.page === pagination.totalPages}
                  onClick={() => fetchCemeteries(pagination.page + 1)}
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
          <Card className="w-full max-w-2xl my-8">
            <CardHeader>
              <CardTitle className="text-lg font-serif">Begraafplaats Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <p className="text-sm text-muted-foreground">Naam</p>
                  <p className="font-medium text-lg">{showDetails.naam}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Type</p>
                  <p className="font-medium capitalize">{showDetails.type}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <div className="mt-1">{getStatusBadge(showDetails.status)}</div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Adres</p>
                  <p className="font-medium">{showDetails.adres || '-'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Postcode</p>
                  <p className="font-medium">{showDetails.postcode || '-'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Plaats</p>
                  <p className="font-medium">{showDetails.plaats}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Gemeente</p>
                  <p className="font-medium">{showDetails.gemeente}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Provincie</p>
                  <p className="font-medium">{showDetails.provincie}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Ingezonden door</p>
                  <p className="font-medium">{showDetails.userName}</p>
                  <p className="text-sm text-muted-foreground">{showDetails.userEmail}</p>
                </div>
              </div>

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
                  <>
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
                    <Button
                      variant="destructive"
                      onClick={() => {
                        setShowRejectModal(showDetails.id);
                        setShowDetails(null);
                      }}
                      className="flex-1"
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      Afwijzen
                    </Button>
                  </>
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
              <CardTitle className="text-lg font-serif">Begraafplaats afwijzen</CardTitle>
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
                    placeholder="Leg uit waarom deze begraafplaats wordt afgewezen..."
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
