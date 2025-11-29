'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FileText, Download } from 'lucide-react';
import { useEffect, useState } from 'react';

interface Report {
  report_id: string;
  session_id: string;
  conversation_id: string;
  filename: string;
  blob_url: string;
  report_type: string;
  created_date: string;
}

export default function ReportsPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const response = await fetch('/api/reports');
      const data = await response.json();
      setReports(data.reports || []);
    } catch (error) {
      console.error('Error fetching reports:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2 text-white">
          <FileText className="h-8 w-8 text-green-400" />
          Surveillance Reports
        </h1>
        <p className="text-gray-400">
          Comprehensive outbreak analysis and surveillance documentation
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <p className="text-gray-400">Loading reports...</p>
        ) : reports.length === 0 ? (
          <Card className="bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl border-white/10">
            <CardContent className="pt-6">
              <p className="text-gray-400">No reports available</p>
            </CardContent>
          </Card>
        ) : (
          reports.map((report, index) => (
            <Card key={`${report.report_id}-${index}`} className="bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl border-white/10 hover:border-white/20 transition-all duration-200 card-hover">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2 text-white">
                  <FileText className="h-5 w-5 text-green-400" />
                  {report.filename}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2 text-sm">
                  <div>
                    <p className="text-gray-400">Type</p>
                    <Badge className="bg-gradient-to-r from-white/10 to-white/5 text-white border-white/20">{report.report_type}</Badge>
                  </div>
                  <div>
                    <p className="text-gray-400">Created</p>
                    <p className="text-white">{new Date(report.created_date).toLocaleString()}</p>
                  </div>
                </div>
                <Button className="w-full bg-gradient-to-r from-green-500/20 to-green-600/10 hover:from-green-500/30 hover:to-green-600/20 text-green-400 border-green-500/20 transition-all duration-200" onClick={() => window.open(report.blob_url, '_blank')}>
                  <Download className="h-4 w-4 mr-2" />
                  Download Report
                </Button>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
