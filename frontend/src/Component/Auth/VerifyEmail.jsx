import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../utils/api';

function VerifyEmail() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [status, setStatus] = useState('verifying'); // 'verifying' | 'success' | 'error'
  const [message, setMessage] = useState('');
  const [resendEmail, setResendEmail] = useState('');
  const [resendLoading, setResendLoading] = useState(false);
  const [resendMessage, setResendMessage] = useState('');
  const [resendError, setResendError] = useState('');

  useEffect(() => {
    // If already logged in, go directly to home
    const existingToken = localStorage.getItem('token');
    if (existingToken) {
      navigate('/home');
      return;
    }

    const verify = async () => {
      try {
        const response = await api.get(`/auth/verify-email/${token}`);

        if (response.data.success) {
          const { token: jwtToken, user } = response.data;
          localStorage.setItem('token', jwtToken);
          localStorage.setItem('user', JSON.stringify(user));
          setStatus('success');
          setMessage(response.data.message || 'Email verified successfully!');
          setTimeout(() => navigate('/home'), 2500);
        }
      } catch (err) {
        const errMsg = err.response?.data?.message || 'Verification failed. The link may have expired.';
        setStatus('error');
        setMessage(errMsg);
      }
    };

    if (token) {
      verify();
    } else {
      setStatus('error');
      setMessage('Invalid verification link.');
    }
  }, [token, navigate]);

  const handleResend = async (e) => {
    e.preventDefault();
    if (!resendEmail.trim()) return;

    setResendLoading(true);
    setResendMessage('');
    setResendError('');

    try {
      const response = await api.post('/auth/resend-verification', { email: resendEmail });
      setResendMessage(response.data.message || 'Verification email sent! Please check your inbox.');
    } catch (err) {
      setResendError(err.response?.data?.message || 'Failed to send verification email.');
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">

        {/* Header Banner */}
        <div className="bg-gradient-to-r from-[#0a3d62] to-[#3c6382] p-8 text-white text-center">
          <div className="flex justify-center mb-4">
            <svg className="w-14 h-14 opacity-90" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/>
            </svg>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">CardioShield AI</h1>
          <p className="text-sm opacity-80 mt-1">Email Verification</p>
        </div>

        {/* Body */}
        <div className="p-8 text-center">

          {/* Verifying State */}
          {status === 'verifying' && (
            <div className="space-y-4">
              <div className="flex justify-center">
                <div className="w-14 h-14 border-4 border-[#0a3d62] border-t-transparent rounded-full animate-spin"></div>
              </div>
              <h2 className="text-xl font-semibold text-[#0a3d62]">Verifying your email...</h2>
              <p className="text-gray-500 text-sm">Please wait while we confirm your account.</p>
            </div>
          )}

          {/* Success State */}
          {status === 'success' && (
            <div className="space-y-4">
              <div className="flex justify-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                  <svg className="w-9 h-9 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
              <h2 className="text-xl font-bold text-green-700">Email Verified!</h2>
              <p className="text-gray-600 text-sm">{message}</p>
              <p className="text-gray-400 text-xs">Redirecting to dashboard in a moment...</p>
              <button
                onClick={() => navigate('/home')}
                className="w-full py-3 bg-[#ff6b4a] text-white rounded-xl font-semibold hover:bg-[#e65a39] transition-all shadow-md hover:shadow-lg mt-2"
              >
                Go to Dashboard
              </button>
            </div>
          )}

          {/* Error State */}
          {status === 'error' && (
            <div className="space-y-4">
              <div className="flex justify-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                  <svg className="w-9 h-9 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
              </div>
              <h2 className="text-xl font-bold text-red-700">Verification Failed</h2>
              <p className="text-gray-600 text-sm">{message}</p>

              {/* Already verified notice */}
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl text-left">
                <p className="text-blue-800 text-sm font-semibold mb-1">Already verified?</p>
                <p className="text-blue-700 text-xs">
                  If you clicked the link before, your email is already verified. Just login below.
                </p>
              </div>

              <button
                onClick={() => navigate('/login')}
                className="w-full py-3 bg-[#ff6b4a] text-white rounded-xl font-semibold hover:bg-[#e65a39] transition-all shadow-md hover:shadow-lg"
              >
                Go to Login
              </button>

              {/* Resend Verification Form */}
              <div className="pt-4 border-t border-gray-200 text-left">
                <p className="text-sm font-semibold text-gray-700 mb-3 text-center">
                  Need a new verification link?
                </p>

                {resendMessage ? (
                  <div className="p-3 bg-green-50 border border-green-300 rounded-xl text-green-700 text-sm text-center">
                    {resendMessage}
                  </div>
                ) : (
                  <form onSubmit={handleResend} className="space-y-3">
                    <input
                      type="email"
                      placeholder="Enter your registered email"
                      value={resendEmail}
                      onChange={(e) => setResendEmail(e.target.value)}
                      required
                      className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:border-[#3c6382] focus:ring-4 focus:ring-[#3c6382]/30 transition-all text-sm"
                    />
                    {resendError && (
                      <p className="text-red-500 text-xs text-center">{resendError}</p>
                    )}
                    <button
                      type="submit"
                      disabled={resendLoading}
                      className="w-full py-3 border-2 border-[#0a3d62] text-[#0a3d62] rounded-xl font-semibold hover:bg-[#0a3d62] hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {resendLoading ? 'Sending...' : 'Resend Verification Email'}
                    </button>
                  </form>
                )}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

export default VerifyEmail;