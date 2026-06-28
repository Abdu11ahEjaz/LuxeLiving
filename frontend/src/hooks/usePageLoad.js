import { useEffect } from 'react';
import { useLoading } from '../context/LoadingContext';

/**
 * Hook to show loading screen when component is fetching data
 * Usage: usePageLoad(isLoading) - pass your component's loading state
 */
export const usePageLoad = (isLoadingData) => {
  const { showLoading, hideLoading } = useLoading();

  useEffect(() => {
    if (isLoadingData) {
      showLoading();
    } else {
      hideLoading();
    }

    return () => hideLoading();
  }, [isLoadingData, showLoading, hideLoading]);
};
