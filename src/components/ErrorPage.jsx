import { useRouteError, Link } from 'react-router-dom';

const ErrorPage = () => {
  const error = useRouteError();

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Oops!</h1>
        <p className="text-xl mb-4">Sorry, an unexpected error has occurred.</p>
        <p className="text-gray-500 mb-6">
          {error?.message || "Unknown error occurred"}
        </p>
        <div className="space-x-4">
          <button 
            onClick={() => window.location.reload()} 
            className="btn btn-primary"
          >
            Try Again
          </button>
          <Link to="/" className="btn btn-ghost">
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage; 