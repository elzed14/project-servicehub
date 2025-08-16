import { useEffect, useState } from 'react';

interface PerformanceMetrics {
  loadTime: number;
  renderTime: number;
  memoryUsage: number;
  fps: number;
}

export const usePerformanceMonitor = () => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    loadTime: 0,
    renderTime: 0,
    memoryUsage: 0,
    fps: 0
  });

  useEffect(() => {
    // Temps de chargement
    const loadTime = performance.now();
    
    // Mesure du rendu
    const renderStart = performance.now();
    requestAnimationFrame(() => {
      const renderTime = performance.now() - renderStart;
      
      // Mémoire (si disponible)
      const memoryUsage = (performance as any).memory?.usedJSHeapSize || 0;
      
      // FPS approximatif
      let fps = 0;
      let frameCount = 0;
      const fpsStart = performance.now();
      
      const measureFPS = () => {
        frameCount++;
        if (performance.now() - fpsStart < 1000) {
          requestAnimationFrame(measureFPS);
        } else {
          fps = frameCount;
          
          setMetrics({
            loadTime,
            renderTime,
            memoryUsage: Math.round(memoryUsage / 1024 / 1024), // MB
            fps
          });
        }
      };
      
      requestAnimationFrame(measureFPS);
    });
  }, []);

  const logMetrics = () => {
    console.group('📊 Performance Metrics');
    console.log(`⏱️ Load Time: ${metrics.loadTime.toFixed(2)}ms`);
    console.log(`🎨 Render Time: ${metrics.renderTime.toFixed(2)}ms`);
    console.log(`💾 Memory Usage: ${metrics.memoryUsage}MB`);
    console.log(`🎯 FPS: ${metrics.fps}`);
    console.groupEnd();
  };

  return { metrics, logMetrics };
};