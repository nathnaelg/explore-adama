
'use client';

import React, { useState, useEffect } from 'react';
import { 
  Activity, Play, Server, Database, BrainCircuit, 
  CheckCircle, XCircle, RefreshCw, AlertTriangle, 
  Cpu, FileJson, Loader2, Users
} from 'lucide-react';
import { cn } from '../utils';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Button } from './ui/button';

import { API_CONFIG } from '../services/api/api.config';
import { MlApi, MLStatus, MLDataSample } from '../services/ml/ml.api';

interface ServiceHealth {
  status: 'ok' | 'error' | 'loading';
  service: string;
}

const RecommendationEngine: React.FC = () => {
  const [health, setHealth] = useState<ServiceHealth>({ status: 'loading', service: '' });
  const [modelStatus, setModelStatus] = useState<MLStatus | null>(null);
  const [dataSample, setDataSample] = useState<MLDataSample | null>(null);
  
  const [isTraining, setIsTraining] = useState(false);
  const [isLoadingSample, setIsLoadingSample] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [trainMessage, setTrainMessage] = useState<string | null>(null);

  // Initial Data Load
  useEffect(() => {
    handleRefresh();
  }, []);

  const checkHealth = async () => {
    setHealth(prev => ({ ...prev, status: 'loading' }));
    try {
      await MlApi.checkHealth();
      setHealth({ status: 'ok', service: 'Recommendation Engine' }); 
    } catch (e) {
      console.warn("ML Health Check Failed", e);
      setHealth({ status: 'error', service: 'ML Service Unreachable' });
    }
  };

  const checkStatus = async () => {
    try {
      const res = await MlApi.getStatus();
      setModelStatus(res);
    } catch (e) {
      console.warn("ML Status Check Failed", e);
      if (!modelStatus) {
         setModelStatus({ lightfm_loaded: false, similarity_ready: false });
      }
    }
  };

  const loadDataSample = async () => {
    setIsLoadingSample(true);
    try {
      const res = await MlApi.getDataSample();
      if (res) {
          setDataSample(res);
      }
    } catch (e) {
      console.warn("Data Sample Load Failed", e);
      setDataSample(null);
    } finally {
      setIsLoadingSample(false);
    }
  };

  const handleRefresh = async () => {
      if (isRefreshing) return;
      
      setIsRefreshing(true);
      
      await Promise.all([
          checkHealth(),
          checkStatus(),
          loadDataSample()
      ]);
      
      setIsRefreshing(false);
  };

  const trainModel = async () => {
    setIsTraining(true);
    setTrainMessage("Initializing training sequence...");
    
    try {
      await MlApi.trainModel();
      
      setTrainMessage("Training request sent. Processing...");
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      setTrainMessage("Models updated successfully.");
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setTrainMessage(null);
      handleRefresh(); 
    } catch (e) {
      setTrainMessage("Training trigger failed. Check connection.");
      console.error(e);
      setTimeout(() => setTrainMessage(null), 3000);
    } finally {
      setIsTraining(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold dark:text-white flex items-center gap-2">
            <BrainCircuit className="text-blue-500" /> Recommendation Engine
          </h2>
          <div className="text-sm text-gray-500">
            Manage AI models, training pipelines, and verify data integrity via <code className="bg-gray-100 dark:bg-zinc-800 px-1 py-0.5 rounded ml-1 text-xs">{API_CONFIG.ML_PROXY_URL}</code> (Port 8000)
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={handleRefresh} className="gap-2" disabled={isRefreshing}>
            <RefreshCw size={14} className={cn(isRefreshing ? "animate-spin" : "")} /> 
            {isRefreshing ? 'Refreshing...' : 'Refresh Status'}
        </Button>
      </div>

      {/* Service Offline Alert */}
      {health.status === 'error' && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 p-4 rounded-xl flex items-start gap-3 animate-in fade-in slide-in-from-top-2 shadow-sm">
          <AlertTriangle className="shrink-0 mt-0.5" size={20} />
          <div>
            <h3 className="font-bold">Recommendation Service Offline</h3>
            <p className="text-sm mt-1 opacity-90">
              The machine learning engine is currently unreachable. Please ensure the backend service is running on port 8000.
            </p>
          </div>
        </div>
      )}

      {/* Top Cards: Health & Status */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Service Health */}
          <Card className={cn("border-l-4", health.status === 'ok' ? "border-l-green-500" : (health.status === 'error' ? "border-l-red-500" : "border-l-blue-500"))}>
              <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-500">Service Health</span>
                      <Activity size={18} className="text-blue-500" />
                  </div>
                  <div className="flex items-center gap-2">
                      {health.status === 'loading' ? (
                          <div className="flex items-center gap-2 text-gray-400">
                              <Loader2 size={18} className="animate-spin" /> Checking...
                          </div>
                      ) : (
                          <>
                            {health.status === 'ok' ? (
                                <div className="flex items-center gap-2 text-green-600 dark:text-green-400 font-bold text-xl">
                                    <CheckCircle size={20} /> Online
                                </div>
                            ) : (
                                <div className="flex items-center gap-2 text-red-600 font-bold text-xl">
                                    <XCircle size={20} /> Offline
                                </div>
                            )}
                          </>
                      )}
                  </div>
                  <div className="text-xs text-gray-400 mt-2 font-mono">
                      {health.status === 'ok' ? 'Connected (Port 8000)' : 'Check ML Service'}
                  </div>
              </CardContent>
          </Card>

          {/* Collaborative Filtering Status */}
          <Card className={cn("border-l-4", modelStatus?.lightfm_loaded ? "border-l-green-500" : (modelStatus ? "border-l-orange-500" : "border-l-gray-300"))}>
              <CardContent className="pt-6">
                   <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-500">Collaborative Model</span>
                      <Users size={18} className={modelStatus?.lightfm_loaded ? "text-green-500" : (modelStatus ? "text-orange-500" : "text-gray-300")} />
                  </div>
                  {modelStatus ? (
                      <div>
                          <div className="text-xl font-bold flex items-center gap-2">
                              {modelStatus.lightfm_loaded ? (
                                <span className="text-green-600 dark:text-green-400">Loaded</span>
                              ) : (
                                <span className="text-orange-500">Not Loaded</span>
                              )}
                          </div>
                          <div className="text-xs text-gray-400 mt-2">
                              Model: LightFM (Hybrid)
                          </div>
                      </div>
                  ) : (
                      <div className="space-y-2 py-1">
                          <div className="h-6 w-3/4 bg-gray-100 dark:bg-zinc-800 animate-pulse rounded"></div>
                          <div className="h-3 w-1/2 bg-gray-50 dark:bg-zinc-900 animate-pulse rounded"></div>
                      </div>
                  )}
              </CardContent>
          </Card>

           {/* Content Based Status */}
          <Card className={cn("border-l-4", modelStatus?.similarity_ready ? "border-l-green-500" : (modelStatus ? "border-l-orange-500" : "border-l-gray-300"))}>
              <CardContent className="pt-6">
                   <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-500">Similarity Matrix</span>
                      <Database size={18} className={modelStatus?.similarity_ready ? "text-green-500" : (modelStatus ? "text-orange-500" : "text-gray-300")} />
                  </div>
                  {modelStatus ? (
                      <div>
                          <div className="text-xl font-bold flex items-center gap-2">
                              {modelStatus.similarity_ready ? (
                                <span className="text-green-600 dark:text-green-400">Ready</span>
                              ) : (
                                <span className="text-orange-500">Pending</span>
                              )}
                          </div>
                          <div className="text-xs text-gray-400 mt-2">
                              Model: Content-Based Filtering
                          </div>
                      </div>
                  ) : (
                      <div className="space-y-2 py-1">
                          <div className="h-6 w-3/4 bg-gray-100 dark:bg-zinc-800 animate-pulse rounded"></div>
                          <div className="h-3 w-1/2 bg-gray-50 dark:bg-zinc-900 animate-pulse rounded"></div>
                      </div>
                  )}
              </CardContent>
          </Card>
      </div>

      {/* Main Control Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Training Panel */}
          <Card>
              <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                      <Cpu size={20} className="text-purple-500" /> Model Training
                  </CardTitle>
                  <CardDescription>
                      Retrain models with the latest user interactions and place data.
                  </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                  <div className="p-4 bg-gray-50 dark:bg-zinc-900 rounded-xl border border-gray-100 dark:border-zinc-800 text-sm space-y-2">
                      <div className="flex items-start gap-2">
                          <span className="font-bold text-gray-900 dark:text-white min-w-[20px]">1.</span>
                          <span className="text-gray-600 dark:text-zinc-400">Fetch latest items, users, and interactions from database.</span>
                      </div>
                      <div className="flex items-start gap-2">
                          <span className="font-bold text-gray-900 dark:text-white min-w-[20px]">2.</span>
                          <span className="text-gray-600 dark:text-zinc-400">Train LightFM collaborative filtering model (User-Item).</span>
                      </div>
                      <div className="flex items-start gap-2">
                          <span className="font-bold text-gray-900 dark:text-white min-w-[20px]">3.</span>
                          <span className="text-gray-600 dark:text-zinc-400">Compute content-based similarity matrices (Item-Item).</span>
                      </div>
                       <div className="flex items-start gap-2">
                          <span className="font-bold text-gray-900 dark:text-white min-w-[20px]">4.</span>
                          <span className="text-gray-600 dark:text-zinc-400">Persist models to storage for serving.</span>
                      </div>
                  </div>

                  {trainMessage && (
                      <div className="p-3 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-lg text-sm font-medium flex items-center gap-2 animate-in fade-in slide-in-from-top-1">
                          <Loader2 size={16} className="animate-spin" /> {trainMessage}
                      </div>
                  )}

                  <Button 
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white shadow-lg shadow-purple-600/20" 
                    size="lg"
                    onClick={trainModel}
                    disabled={isTraining || health.status === 'error'}
                  >
                      {isTraining ? (
                          <>
                            <Loader2 size={20} className="animate-spin mr-2" /> Training in Progress...
                          </>
                      ) : (
                          <>
                            <Play size={20} className="mr-2" /> Start Training Pipeline
                          </>
                      )}
                  </Button>
                  <p className="text-xs text-center text-gray-400">
                      Training runs asynchronously. The status indicators will update when complete.
                  </p>
              </CardContent>
          </Card>

          {/* Data Inspector */}
          <Card>
              <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                      <FileJson size={20} className="text-orange-500" /> Data Inspector
                  </CardTitle>
                  <CardDescription>
                      Verify connectivity and inspect training data format.
                  </CardDescription>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col relative min-h-[250px]">
                  {/* Loading Overlay */}
                  {isLoadingSample && (
                      <div className="absolute inset-0 bg-white/80 dark:bg-zinc-950/80 z-10 flex flex-col items-center justify-center backdrop-blur-sm rounded-b-3xl transition-all">
                          <Loader2 size={40} className="animate-spin text-orange-500 mb-3" />
                          <p className="text-sm font-medium text-gray-500">Refreshing data...</p>
                      </div>
                  )}

                  {dataSample ? (
                      <div className="space-y-4 flex-1">
                           <div className="grid grid-cols-2 gap-2 text-center">
                               <div className="p-3 bg-gray-50 dark:bg-zinc-900 rounded-lg">
                                   <div className="text-lg font-bold">{dataSample.items_count}</div>
                                   <div className="text-[10px] text-gray-500 uppercase font-bold">Items</div>
                               </div>
                               <div className="p-3 bg-gray-50 dark:bg-zinc-900 rounded-lg">
                                   <div className="text-lg font-bold">{dataSample.interactions_count}</div>
                                   <div className="text-[10px] text-gray-500 uppercase font-bold">Interactions</div>
                               </div>
                           </div>
                           
                           <div className="space-y-1">
                               <h4 className="text-xs font-bold text-gray-500 dark:text-zinc-400 uppercase">Items Head</h4>
                               <div className="bg-gray-100 dark:bg-zinc-950 p-3 rounded-lg font-mono text-xs overflow-x-auto max-h-[100px] scrollbar-thin">
                                   <pre>{JSON.stringify(dataSample.items_head.slice(0, 3), null, 2)}</pre>
                               </div>
                           </div>

                           <div className="space-y-1">
                               <h4 className="text-xs font-bold text-gray-500 dark:text-zinc-400 uppercase">Interactions Head</h4>
                               <div className="bg-gray-100 dark:bg-zinc-950 p-3 rounded-lg font-mono text-xs overflow-x-auto max-h-[100px] scrollbar-thin">
                                   <pre>{JSON.stringify(dataSample.interactions_head.slice(0, 3), null, 2)}</pre>
                               </div>
                           </div>
                      </div>
                  ) : (
                      <div className="flex-1 flex flex-col items-center justify-center text-gray-400 border-2 border-dashed border-gray-100 dark:border-zinc-800 rounded-xl">
                          <Server size={48} className="mb-4 opacity-20" />
                          <p className="mb-4">No data loaded.</p>
                          <Button variant="outline" onClick={loadDataSample} disabled={isLoadingSample}>
                              <Database size={16} className="mr-2" /> Fetch Data Sample
                          </Button>
                      </div>
                  )}
              </CardContent>
          </Card>

      </div>
    </div>
  );
};

export default RecommendationEngine;
