'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search } from 'lucide-react';
import { useEffect, useState } from 'react';

interface Anomaly {
  anomaly_id: string;
  timestamp: string;
  region: string;
  anomaly_type: string;
  severity: string;
  confidence: number;
  data_source: string;
  baseline_value: number;
  current_value: number;
  deviation_percent: number;
  detection_method: string;
}

export default function AnomaliesPage() {
  const [anomalies, setAnomalies] = useState<Anomaly[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnomalies();
  }, []);

  const fetchAnomalies = async () => {
    try {
      const response = await fetch('/api/anomalies?days=7');
      const data = await response.json();
      setAnomalies(data.anomalies || []);
    } catch (error) {
      console.error('Error fetching anomalies:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2 text-white">
          <Search className="h-8 w-8 text-green-400" />
          Anomaly Detection
        </h1>
        <p className="text-gray-400">
          Multi-source health data anomalies and pattern analysis
        </p>
      </div>

      <div className="space-y-4">
        {loading ? (
          <p className="text-gray-400">Loading anomalies...</p>
        ) : anomalies.length === 0 ? (
          <Card className="bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl border-white/10">
            <CardContent className="pt-6">
              <p className="text-gray-400 text-center">No anomalies detected</p>
            </CardContent>
          </Card>
        ) : (
          anomalies.map((anomaly, index) => (
            <Card key={`${anomaly.anomaly_id}-${index}`} className="bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl border-white/10 hover:border-white/20 transition-all duration-200 card-hover">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg text-white">{anomaly.anomaly_type}</CardTitle>
                  <Badge className={`${
                    anomaly.severity === 'high' || anomaly.severity === 'critical' 
                      ? 'bg-gradient-to-r from-red-500/20 to-red-600/10 text-red-400 border-red-500/20' 
                      : 'bg-gradient-to-r from-orange-500/20 to-orange-600/10 text-orange-400 border-orange-500/20'
                  }`}>
                    {anomaly.severity}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="text-gray-400">Region</p>
                  <p className="font-medium text-white">{anomaly.region}</p>
                </div>
                <div>
                  <p className="text-gray-400">Data Source</p>
                  <p className="font-medium text-white">{anomaly.data_source}</p>
                </div>
                <div>
                  <p className="text-gray-400">Deviation</p>
                  <p className="font-medium text-red-400">
                    +{typeof anomaly.deviation_percent === 'number' 
                      ? anomaly.deviation_percent.toFixed(1) 
                      : parseFloat(anomaly.deviation_percent as any)?.toFixed(1) || '0.0'}%
                  </p>
                </div>
                <div>
                  <p className="text-gray-400">Confidence</p>
                  <p className="font-medium text-white">
                    {typeof anomaly.confidence === 'number' 
                      ? (anomaly.confidence * 100).toFixed(0) 
                      : (parseFloat(anomaly.confidence as any) * 100)?.toFixed(0) || '0'}%
                  </p>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
