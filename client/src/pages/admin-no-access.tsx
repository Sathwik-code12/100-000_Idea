import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, ArrowLeft, AlertTriangle } from "lucide-react";

export default function AdminNoAccess() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-red-900 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="border-slate-700 bg-slate-800/50 backdrop-blur-sm">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-gradient-to-r from-red-500 to-orange-500 rounded-full">
                <AlertTriangle className="h-8 w-8 text-white" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-white">
              Access Denied
            </CardTitle>
            <p className="text-slate-400">
              You do not have permission to access this area
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                <div className="flex items-center justify-center gap-3 mb-3">
                  <Shield className="h-5 w-5 text-red-400" />
                  <span className="text-red-400 font-semibold">Restricted Area</span>
                </div>
                <p className="text-sm text-slate-300">
                  This admin panel is restricted to authorized personnel only. 
                  Only two designated admin users have access to this system.
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-sm text-slate-400 text-center">
                If you believe you should have access to this area, please contact 
                the system administrator.
              </p>
              
              <div className="flex flex-col gap-3">
                <Link href="/">
                  <Button className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Return to Homepage
                  </Button>
                </Link>
                
                <Link href="/contact">
                  <Button variant="outline" className="w-full text-white border-slate-600 hover:bg-slate-700">
                    Contact Support
                  </Button>
                </Link>
              </div>
            </div>

            <div className="mt-6 p-4 bg-slate-700/50 rounded-lg">
              <p className="text-xs text-slate-400 text-center">
                All access attempts are logged and monitored for security purposes.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}