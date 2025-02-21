import { Link, useRouteError } from 'react-router-dom';

function ErrorPage() {
  const error = useRouteError();
  
  // Get appropriate error message and status
  const getErrorDetails = () => {
    if (error?.status === 404) {
      return {
        status: '404',
        title: 'Page Not Found',
        message: "The page you're looking for doesn't exist or has been moved."
      };
    } else if (error?.status === 403) {
      return {
        status: '403',
        title: 'Access Denied',
        message: 'You do not have permission to access this page.'
      };
    } else if (error?.status === 401) {
      return {
        status: '401',
        title: 'Unauthorized',
        message: 'Please login to access this page.'
      };
    } else {
      return {
        status: '500',
        title: 'Unexpected Error',
        message: 'Something went wrong. Please try again later.'
      };
    }
  };

  const errorDetails = getErrorDetails();

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200">
      <div className="text-center p-8 bg-base-100 rounded-xl shadow-lg max-w-md">
        <h1 className="text-6xl font-bold mb-4 text-error">{errorDetails.status}</h1>
        <h2 className="text-2xl font-semibold mb-4">{errorDetails.title}</h2>
        <p className="text-base-content/70 mb-8">
          {errorDetails.message}
        </p>
        <div className="space-y-4">
          <Link 
            to="/" 
            className="btn btn-primary w-full"
          >
            Go Back Home
          </Link>
          {(error?.status === 401 || error?.status === 403) && (
            <Link 
              to="/login" 
              className="btn btn-outline w-full"
            >
              Login
            </Link>
          )}
          <button 
            onClick={() => window.history.back()} 
            className="btn btn-ghost w-full"
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
}

export default ErrorPage; 