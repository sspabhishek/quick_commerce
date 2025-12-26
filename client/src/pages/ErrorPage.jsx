import React from 'react';
import { useRouteError, Link } from 'react-router-dom';

const ErrorPage = () => {
    const error = useRouteError();
    console.error(error);

    return (
        <div className='flex flex-col items-center justify-center min-h-screen bg-slate-50 p-4'>
            <div className='bg-white p-8 rounded-lg shadow-lg text-center max-w-md w-full'>
                <h1 className='text-4xl font-bold text-red-500 mb-4'>Oops!</h1>
                <p className='text-lg text-gray-700 mb-4'>Sorry, an unexpected error has occurred.</p>
                <div className='bg-gray-100 p-4 rounded mb-6 text-left overflow-auto max-h-40'>
                    <p className='text-sm text-gray-500 font-mono'>
                        {error.statusText || error.message}
                    </p>
                </div>
                <Link
                    to="/"
                    className='inline-block px-6 py-2 bg-green-600 text-white font-semibold rounded hover:bg-green-700 transition-colors'
                >
                    Go to Home
                </Link>
            </div>
        </div>
    );
};

export default ErrorPage;
