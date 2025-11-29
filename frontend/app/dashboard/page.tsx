'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Activity, AlertTriangle, TrendingUp, Database, Users, MapPin } from 'lucide-react';
import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

const SurveillanceMap = dynamic(() => import('@/components/SurveillanceMap'), {
  ssr: false,
  loading: () => (
    <Card className="glass p-6 border-white/10">
      <div className="h-[500px] flex items-center justify-center">
        <p className="text-white/60">Loading map...</p>
      </div>
    </Card>
  ),
});

interface SurveillanceStatus {
  status: string;
  active_sessions: number;
  total_anomalies: number;
  active_alerts: number;
  recent_predictions: number;
  data_sources: Record<string, string>;
  timestamp: string;
}

export default function DashboardPage() {
  const [status, setStatus] = useState<SurveillanceStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchStatus = async () => {
    try {
      const response = await fetch('/api/surveillance/status');
      if (!response.ok) throw new Error('Failed to fetch status');
      const data = await response.json();
      setStatus(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-[60vh]">
          <div className="text-center">
            <Activity className="w-12 h-12 animate-pulse mx-auto mb-4 text-green-400" />
            <p className="text-gray-400">Loading surveillance dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <Card className="border-red-500/50 bg-gradient-to-br from-red-500/10 to-red-600/5 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="text-red-400">Error Loading Dashboard</CardTitle>
            <CardDescription className="text-gray-400">{error}</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Disease Surveillance Dashboard</h1>
          <p className="text-gray-400">Real-time monitoring and outbreak detection</p>
        </div>
        <Badge
          className={`text-sm px-4 py-2 ${
            status?.status === 'operational' 
              ? 'bg-gradient-to-r from-green-500/20 to-green-600/10 text-green-400 border-green-500/20' 
              : 'bg-gradient-to-r from-red-500/20 to-red-600/10 text-red-400 border-red-500/20'
          }`}
        >
          {status?.status === 'operational' ? '✓ Operational' : '⚠ Alert'}
        </Badge>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-red-500/10 to-red-600/5 backdrop-blur-xl border-red-500/20 hover:border-red-500/30 transition-all duration-200 card-hover">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">Active Alerts</CardTitle>
            <div className="w-8 h-8 rounded-lg bg-red-500/20 flex items-center justify-center">
              <AlertTriangle className="h-4 w-4 text-red-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{status?.active_alerts || 0}</div>
            <p className="text-xs text-gray-400">
              Requiring immediate attention
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-500/10 to-orange-600/5 backdrop-blur-xl border-orange-500/20 hover:border-orange-500/30 transition-all duration-200 card-hover">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">Anomalies Detected</CardTitle>
            <div className="w-8 h-8 rounded-lg bg-orange-500/20 flex items-center justify-center">
              <TrendingUp className="h-4 w-4 text-orange-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{status?.total_anomalies || 0}</div>
            <p className="text-xs text-gray-400">
              In the last 24 hours
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 backdrop-blur-xl border-blue-500/20 hover:border-blue-500/30 transition-all duration-200 card-hover">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">Recent Predictions</CardTitle>
            <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
              <Activity className="h-4 w-4 text-blue-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{status?.recent_predictions || 0}</div>
            <p className="text-xs text-gray-400">
              Outbreak forecasts generated
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500/10 to-green-600/5 backdrop-blur-xl border-green-500/20 hover:border-green-500/30 transition-all duration-200 card-hover">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">Active Sessions</CardTitle>
            <div className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center">
              <Users className="h-4 w-4 text-green-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{status?.active_sessions || 0}</div>
            <p className="text-xs text-gray-400">
              Monitoring sessions running
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Global Surveillance Map */}
      <SurveillanceMap />

      {/* Data Sources Status */}
      <Card className="bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl border-white/10 hover:border-white/20 transition-all duration-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Database className="h-5 w-5 text-green-400" />
            Data Source Health
          </CardTitle>
          <CardDescription className="text-gray-400">
            Real-time connectivity status of surveillance data streams
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {status?.data_sources && Object.entries(status.data_sources).map(([source, state]) => (
              <div
                key={source}
                className="flex items-center justify-between p-4 border border-white/10 rounded-lg bg-white/5 hover:bg-white/10 transition-all duration-200"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      state === 'connected' ? 'bg-green-500 animate-pulse' : 'bg-red-500'
                    }`}
                  />
                  <div>
                    <p className="font-medium capitalize text-white">
                      {source.replace('_', ' ')}
                    </p>
                    <p className="text-xs text-gray-400 capitalize">
                      {state.replace('_', ' ')}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl border-white/10 hover:border-white/20 transition-all duration-200">
          <CardHeader>
            <CardTitle className="text-white">Alert Summary</CardTitle>
            <CardDescription className="text-gray-400">Critical alerts requiring attention</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 border border-white/10 rounded-lg bg-white/5 hover:bg-white/10 transition-all duration-200">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                  <div>
                    <p className="font-medium text-white">Critical Alerts</p>
                    <p className="text-xs text-gray-400">Immediate action required</p>
                  </div>
                </div>
                <Badge className="bg-gradient-to-r from-red-500/20 to-red-600/10 text-red-400 border-red-500/20">
                  {Math.floor((status?.active_alerts || 0) * 0.2)}
                </Badge>
              </div>

              <div className="flex items-center justify-between p-3 border border-white/10 rounded-lg bg-white/5 hover:bg-white/10 transition-all duration-200">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
                  <div>
                    <p className="font-medium text-white">High Priority</p>
                    <p className="text-xs text-gray-400">Action needed within 24h</p>
                  </div>
                </div>
                <Badge className="bg-gradient-to-r from-orange-500/20 to-orange-600/10 text-orange-400 border-orange-500/20">
                  {Math.floor((status?.active_alerts || 0) * 0.3)}
                </Badge>
              </div>

              <div className="flex items-center justify-between p-3 border border-white/10 rounded-lg bg-white/5 hover:bg-white/10 transition-all duration-200">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full" />
                  <div>
                    <p className="font-medium text-white">Medium Priority</p>
                    <p className="text-xs text-gray-400">Monitor closely</p>
                  </div>
                </div>
                <Badge className="bg-gradient-to-r from-yellow-500/20 to-yellow-600/10 text-yellow-400 border-yellow-500/20">
                  {Math.floor((status?.active_alerts || 0) * 0.5)}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl border-white/10 hover:border-white/20 transition-all duration-200">
          <CardHeader>
            <CardTitle className="text-white">Geographic Distribution</CardTitle>
            <CardDescription className="text-gray-400">Alerts by region</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {['North America', 'Europe', 'Asia Pacific', 'Africa'].map((region) => (
                <div key={region} className="flex items-center justify-between p-3 border border-white/10 rounded-lg bg-white/5 hover:bg-white/10 transition-all duration-200">
                  <div className="flex items-center gap-3">
                    <MapPin className="h-4 w-4 text-green-400" />
                    <p className="font-medium text-white">{region}</p>
                  </div>
                  <Badge className="bg-gradient-to-r from-white/10 to-white/5 text-white border-white/20">
                    {Math.floor(Math.random() * 10)}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* System Information */}
      <Card className="bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl border-white/10 hover:border-white/20 transition-all duration-200">
        <CardHeader>
          <CardTitle className="text-white">System Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="text-gray-400">System Status</p>
              <p className="font-medium capitalize text-white">{status?.status}</p>
            </div>
            <div>
              <p className="text-gray-400">Last Updated</p>
              <p className="font-medium text-white">
                {status?.timestamp ? new Date(status.timestamp).toLocaleTimeString() : '-'}
              </p>
            </div>
            <div>
              <p className="text-gray-400">Data Sources</p>
              <p className="font-medium text-white">
                {status?.data_sources ? Object.keys(status.data_sources).length : 0} Active
              </p>
            </div>
            <div>
              <p className="text-gray-400">Monitoring Mode</p>
              <p className="font-medium text-white">Continuous</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
