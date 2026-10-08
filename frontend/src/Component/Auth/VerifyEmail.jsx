import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../../utils/api';
import { Activity, CheckCircle2, AlertCircle, RefreshCw, Mail, ArrowRight } from 'lucide-react';

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
          setTimeout(() => navigate('/home'), 2200);
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
      setResendMessage(response.data.message || 'Verification email dispatched. Please check your inbox.');
    } catch (err) {
      setResendError(err.response?.data?.message || 'Failed to dispatch verification email.');
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F8FC] flex items-center justify-center p-4 antialiased">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-[#E0E8F0] overflow-hidden">

        {/* Header Banner */}
        <div className="bg-gradient-to-r from-[#0B1F33] via-[#0E2A44] to-[#123B5D] p-8 text-white text-center relative overflow-hidden">
          <div className="absolute -top-12 -left-12 w-32 h-32 bg-[#13B8A6]/20 rounded-full blur-2xl pointer-events-none" />
          <div className="flex justify-center mb-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#13B8A6] to-[#20D9C2] flex items-center justify-center text-[#0B1F33] shadow-md shadow-[#20D9C2]/20">
              <Activity size={26} className="stroke-[2.5]" />
            </div>
          </div>
          <h1 className="text-xl font-extrabold tracking-tight font-display">CardioShield AI</h1>
          <p className="text-xs text-slate-300 mt-1">Clinical Email Verification</p>
        </div>

        {/* Content Body */}
        <div className="p-8 text-center">

          {/* Verifying State */}
          {status === 'verifying' && (
            <div className="space-y-4 py-4">
              <div className="flex justify-center">
                <div className="w-12 h-12 border-3 border-[#20D9C2] border-t-transparent rounded-full animate-spin"></div>
              </div>
              <h2 className="text-lg font-bold text-[#0B1F33]">Verifying Clinical Credentials...</h2>
              <p className="text-[#627487] text-xs">Confirming your authorized practitioner profile.</p>
            </div>
          )}

          {/* Success State */}
          {status === 'success' && (
            <div className="space-y-4 py-4">
              <div className="flex justify-center">
                <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center text-[#16866A] border border-emerald-200">
                  <CheckCircle2 size={32} />
                </div>
              </div>
              <h2 className="text-xl font-bold text-[#16866A]">Email Verified!</h2>
              <p className="text-xs text-[#627487]">{message}</p>
              <p className="text-[11px] text-slate-400">Directing to diagnostic portal...</p>
              <button
                onClick={() => navigate('/home')}
                className="w-full mt-2 py-3 bg-gradient-to-r from-[#13B8A6] to-[#20D9C2] text-[#0B1F33] rounded-xl font-bold text-xs shadow-md shadow-[#20D9C2]/25 hover:shadow-lg transition-all flex items-center justify-center gap-1.5"
              >
                <span>Enter Portal Now</span>
                <ArrowRight size={14} />
              </button>
            </div>
          )}

          {/* Error State */}
          {status === 'error' && (
            <div className="space-y-4 py-2">
              <div className="flex justify-center">
                <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center text-[#D94F59] border border-red-200">
                  <AlertCircle size={32} />
                </div>
              </div>
              <h2 className="text-xl font-bold text-[#D94F59]">Verification Expired or Invalid</h2>
              <p className="text-xs text-[#627487]">{message}</p>

              <div className="p-3.5 bg-blue-50 border border-blue-200 rounded-xl text-left text-xs">
                <p className="text-[#123B5D] font-bold mb-1">Already confirmed?</p>
                <p className="text-slate-600 text-[11px]">
                  If you already verified this account, your credentials are ready.
                </p>
                <button
                  onClick={() => navigate('/login')}
                  className="mt-2 text-[#13B8A6] font-bold hover:underline"
                >
                  Sign In with Your Password →
                </button>
              </div>

              {/* Resend Verification Form */}
              <div className="pt-4 border-t border-[#E0E8F0] text-left">
                <p className="text-xs font-semibold text-[#172B3A] mb-3 text-center">
                  Request a New Link:
                </p>

                {resendMessage ? (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-[#16866A] text-xs text-center font-medium">
                    {resendMessage}
                  </div>
                ) : (
                  <form onSubmit={handleResend} className="space-y-3">
                    <div className="relative group">
                      <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#13B8A6]" />
                      <input
                        type="email"
                        placeholder="doctor@hospital.org"
                        value={resendEmail}
                        onChange={(e) => setResendEmail(e.target.value)}
                        required
                        className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-[#E0E8F0] focus:outline-none focus:border-[#13B8A6] text-xs text-[#172B3A]"
                      />
                    </div>
                    {resendError && (
                      <p className="text-red-500 text-[11px] text-center">{resendError}</p>
                    )}
                    <button
                      type="submit"
                      disabled={resendLoading}
                      className="w-full py-2.5 bg-[#123B5D] text-white rounded-xl text-xs font-bold hover:bg-[#0B1F33] transition-all disabled:opacity-50"
                    >
                      {resendLoading ? 'Dispatching...' : 'Resend Verification Email'}
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
