'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AlertTriangle, Filter, Search, MapPin, Clock, Users } from 'lucide-react';
import { useEffect, useState } from 'react';

interface Alert {
  alert_id: string;
  alert_type: string;
  severity: string;
  region: string;
  disease_name: string;
  message: string;
  audience: string;
  status: string;
  created_date: string;
}

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    region: '',
    severity: '',
    status: 'active',
  });

  useEffect(() => {
    fetchAlerts();
  }, [filters]);

  const fetchAlerts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.region) params.append('region', filters.region);
      if (filters.severity) params.append('severity', filters.severity);
      if (filters.status) params.append('status', filters.status);

      const response = await fetch(`/api/alerts?${params.toString()}`);
      const data = await response.json();
      setAlerts(data.alerts || []);
    } catch (error) {
      console.error('Error fetching alerts:', error);
    } finally {
      setLoading(false);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'critical':
        return 'destructive';
      case 'high':
        return 'default';
      case 'medium':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'critical':
        return '🔴';
      case 'high':
        return '🟠';
      case 'medium':
        return '🟡';
      default:
        return '🟢';
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2 text-white">
          <AlertTriangle className="h-8 w-8 text-red-400" />
          Surveillance Alerts
        </h1>
        <p className="text-gray-400">
          Monitor and manage health alerts across all regions
        </p>
      </div>

      {/* Filters */}
      <Card className="bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl border-white/10 hover:border-white/20 transition-all duration-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Filter className="h-5 w-5 text-green-400" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Input
              placeholder="Search region..."
              value={filters.region}
              onChange={(e) => setFilters({ ...filters, region: e.target.value })}
            />
            <select
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm"
              value={filters.severity}
              onChange={(e) => setFilters({ ...filters, severity: e.target.value })}
            >
              <option value="">All Severities</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
            <select
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm"
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            >
              <option value="active">Active</option>
              <option value="resolved">Resolved</option>
              <option value="archived">Archived</option>
            </select>
            <Button onClick={fetchAlerts}>
              <Search className="h-4 w-4 mr-2" />
              Apply Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Alert Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-red-500/10 to-red-600/5 backdrop-blur-xl border-red-500/20 hover:border-red-500/30 transition-all duration-200 card-hover">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-red-400">
                {alerts.filter((a) => a.severity === 'critical').length}
              </div>
              <p className="text-sm text-gray-400 mt-1">Critical Alerts</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-orange-500/10 to-orange-600/5 backdrop-blur-xl border-orange-500/20 hover:border-orange-500/30 transition-all duration-200 card-hover">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-400">
                {alerts.filter((a) => a.severity === 'high').length}
              </div>
              <p className="text-sm text-gray-400 mt-1">High Priority</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-yellow-500/10 to-yellow-600/5 backdrop-blur-xl border-yellow-500/20 hover:border-yellow-500/30 transition-all duration-200 card-hover">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-400">
                {alerts.filter((a) => a.severity === 'medium').length}
              </div>
              <p className="text-sm text-gray-400 mt-1">Medium Priority</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl border-white/10 hover:border-white/20 transition-all duration-200 card-hover">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-white">{alerts.length}</div>
              <p className="text-sm text-gray-400 mt-1">Total Alerts</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alerts List */}
      <Card className="bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl border-white/10 hover:border-white/20 transition-all duration-200">
        <CardHeader>
          <CardTitle className="text-white">Alert Details</CardTitle>
          <CardDescription className="text-gray-400">
            Showing {alerts.length} alert{alerts.length !== 1 ? 's' : ''}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[600px]">
            {loading ? (
              <div className="text-center py-12">
                <p className="text-gray-400">Loading alerts...</p>
              </div>
            ) : alerts.length === 0 ? (
              <div className="text-center py-12">
                <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <p className="text-gray-400">No alerts found</p>
              </div>
            ) : (
              <div className="space-y-4">
                {alerts.map((alert, index) => (
                  <Card key={`${alert.alert_id}-${index}`} className="border-l-4 bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl border-white/10 hover:border-white/20 transition-all duration-200" style={{
                    borderLeftColor: alert.severity === 'critical' ? '#ef4444' :
                                    alert.severity === 'high' ? '#f97316' :
                                    alert.severity === 'medium' ? '#eab308' : '#22c55e'
                  }}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-xl">{getSeverityIcon(alert.severity)}</span>
                            <Badge className={`${
                              alert.severity === 'critical' ? 'bg-gradient-to-r from-red-500/20 to-red-600/10 text-red-400 border-red-500/20' :
                              alert.severity === 'high' ? 'bg-gradient-to-r from-orange-500/20 to-orange-600/10 text-orange-400 border-orange-500/20' :
                              alert.severity === 'medium' ? 'bg-gradient-to-r from-yellow-500/20 to-yellow-600/10 text-yellow-400 border-yellow-500/20' :
                              'bg-gradient-to-r from-green-500/20 to-green-600/10 text-green-400 border-green-500/20'
                            }`}>
                              {alert.severity.toUpperCase()}
                            </Badge>
                            <Badge className="bg-gradient-to-r from-white/10 to-white/5 text-white border-white/20">{alert.alert_type}</Badge>
                          </div>
                          <CardTitle className="text-lg text-white">{alert.disease_name}</CardTitle>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm mb-4 text-gray-300">{alert.message}</p>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div className="flex items-center gap-2 text-gray-400">
                          <MapPin className="h-4 w-4" />
                          <span>{alert.region}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-400">
                          <Users className="h-4 w-4" />
                          <span>{alert.audience}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-400">
                          <Clock className="h-4 w-4" />
                          <span>{new Date(alert.created_date).toLocaleString()}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
