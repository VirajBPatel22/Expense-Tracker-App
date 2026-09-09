import React, { useState } from 'react';
import styled from 'styled-components';
import { useGlobalContext } from '../../context/globalContext';
import { FaLock, FaEnvelope, FaUser, FaEye, FaEyeSlash, FaArrowRight } from 'react-icons/fa';

function Auth() {
    const { login, register, authLoading, authError, setAuthError } = useGlobalContext();
    const [isSignUp, setIsSignUp] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: ''
    });

    const { name, email, password } = formData;

    const handleInput = (key) => (e) => {
        setFormData({ ...formData, [key]: e.target.value });
        if (authError) setAuthError(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isSignUp) {
            if (!name.trim() || !email.trim() || !password.trim()) {
                setAuthError('Please fill in all fields');
                return;
            }
            if (password.length < 6) {
                setAuthError('Password must be at least 6 characters');
                return;
            }
            await register(name, email, password);
        } else {
            if (!email.trim() || !password.trim()) {
                setAuthError('Please enter your email and password');
                return;
            }
            await login(email, password);
        }
    };

    const switchMode = (signUpMode) => {
        setIsSignUp(signUpMode);
        setAuthError(null);
    };

    return (
        <AuthWrapper>
            <div className="auth-card">
                {/* Logo & Title */}
                <div className="auth-header">
                    <div className="app-badge">💰 ExpenseTracker Pro</div>
                    <h2>{isSignUp ? 'Create Your Account' : 'Welcome Back'}</h2>
                    <p className="subtitle">
                        {isSignUp
                            ? 'Start tracking, budgeting, and mastering your finances today'
                            : 'Sign in to access your personal financial command center'}
                    </p>
                </div>

                {/* Mode Selector Tabs */}
                <div className="tab-container">
                    <button
                        className={`tab-btn ${!isSignUp ? 'active' : ''}`}
                        onClick={() => switchMode(false)}
                    >
                        Sign In
                    </button>
                    <button
                        className={`tab-btn ${isSignUp ? 'active' : ''}`}
                        onClick={() => switchMode(true)}
                    >
                        Sign Up
                    </button>
                </div>

                {/* Error Banner */}
                {authError && <div className="error-banner">{authError}</div>}

                {/* Form */}
                <form onSubmit={handleSubmit}>
                    {isSignUp && (
                        <div className="input-field">
                            <label>Full Name</label>
                            <div className="input-box">
                                <FaUser className="input-icon" />
                                <input
                                    type="text"
                                    placeholder="Enter your name"
                                    value={name}
                                    onChange={handleInput('name')}
                                    required
                                />
                            </div>
                        </div>
                    )}

                    <div className="input-field">
                        <label>Email Address</label>
                        <div className="input-box">
                            <FaEnvelope className="input-icon" />
                            <input
                                type="email"
                                placeholder="name@example.com"
                                value={email}
                                onChange={handleInput('email')}
                                required
                            />
                        </div>
                    </div>

                    <div className="input-field">
                        <label>Password</label>
                        <div className="input-box">
                            <FaLock className="input-icon" />
                            <input
                                type={showPassword ? 'text' : 'password'}
                                placeholder={isSignUp ? 'Min 6 characters' : 'Enter password'}
                                value={password}
                                onChange={handleInput('password')}
                                required
                            />
                            <button
                                type="button"
                                className="eye-btn"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </button>
                        </div>
                    </div>

                    <button type="submit" className="submit-auth-btn" disabled={authLoading}>
                        {authLoading
                            ? (isSignUp ? 'Creating Account...' : 'Signing In...')
                            : (
                                <>
                                    {isSignUp ? 'Get Started' : 'Sign In'} <FaArrowRight />
                                </>
                            )}
                    </button>
                </form>

                {/* Footer switch prompt */}
                <div className="auth-footer">
                    {isSignUp ? (
                        <p>
                            Already have an account?{' '}
                            <button onClick={() => switchMode(false)}>Sign In</button>
                        </p>
                    ) : (
                        <p>
                            Don't have an account yet?{' '}
                            <button onClick={() => switchMode(true)}>Create One</button>
                        </p>
                    )}
                </div>
            </div>
        </AuthWrapper>
    );
}

const AuthWrapper = styled.div`
    width: 100%;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 1.5rem;
    position: relative;
    z-index: 10;

    .auth-card {
        width: 100%;
        max-width: 440px;
        background: rgba(252, 246, 249, 0.88);
        border: 3px solid #FFFFFF;
        backdrop-filter: blur(12px);
        box-shadow: 0px 20px 50px rgba(34, 34, 96, 0.15);
        border-radius: 32px;
        padding: 2.5rem 2rem;
        animation: scaleUp 0.3s ease-out;

        @keyframes scaleUp {
            from { transform: scale(0.95); opacity: 0; }
            to { transform: scale(1); opacity: 1; }
        }

        .auth-header {
            text-align: center;
            margin-bottom: 1.5rem;

            .app-badge {
                display: inline-block;
                background: #fff;
                border: 2px solid #FFFFFF;
                box-shadow: 0px 1px 10px rgba(0, 0, 0, 0.05);
                padding: 0.3rem 0.9rem;
                border-radius: 20px;
                font-size: 0.85rem;
                font-weight: 700;
                color: #222260;
                margin-bottom: 0.8rem;
            }

            h2 {
                font-size: 1.6rem;
                color: #222260;
                margin-bottom: 0.3rem;
            }

            .subtitle {
                font-size: 0.88rem;
                color: rgba(34, 34, 96, 0.6);
                line-height: 1.4;
            }
        }

        .tab-container {
            display: flex;
            background: #fff;
            padding: 4px;
            border-radius: 16px;
            margin-bottom: 1.5rem;
            box-shadow: 0px 1px 10px rgba(0, 0, 0, 0.04);

            .tab-btn {
                flex: 1;
                border: none;
                background: transparent;
                padding: 0.6rem 0;
                font-family: inherit;
                font-size: 0.95rem;
                font-weight: 700;
                color: rgba(34, 34, 96, 0.5);
                border-radius: 12px;
                cursor: pointer;
                transition: all 0.25s ease;

                &.active {
                    background: #222260;
                    color: #fff;
                    box-shadow: 0px 4px 12px rgba(34, 34, 96, 0.2);
                }
            }
        }

        .error-banner {
            background: #ffebee;
            color: #d32f2f;
            border: 1px solid #ffcdd2;
            padding: 0.7rem 1rem;
            border-radius: 12px;
            font-size: 0.88rem;
            font-weight: 600;
            margin-bottom: 1.2rem;
            text-align: center;
            animation: shake 0.3s ease-in-out;
        }

        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            20%, 60% { transform: translateX(-6px); }
            40%, 80% { transform: translateX(6px); }
        }

        form {
            display: flex;
            flex-direction: column;
            gap: 1.1rem;

            .input-field {
                display: flex;
                flex-direction: column;
                gap: 0.35rem;

                label {
                    font-size: 0.85rem;
                    font-weight: 700;
                    color: #222260;
                }

                .input-box {
                    position: relative;
                    display: flex;
                    align-items: center;

                    .input-icon {
                        position: absolute;
                        left: 1rem;
                        color: rgba(34, 34, 96, 0.4);
                        font-size: 0.95rem;
                    }

                    input {
                        width: 100%;
                        padding: 0.75rem 2.6rem 0.75rem 2.6rem;
                        font-family: inherit;
                        font-size: 0.95rem;
                        border: 2px solid #FFFFFF;
                        border-radius: 14px;
                        background: #fff;
                        box-shadow: 0px 1px 10px rgba(0, 0, 0, 0.04);
                        color: #222260;
                        outline: none;
                        transition: all 0.2s ease;

                        &:focus {
                            border-color: #222260;
                        }

                        &::placeholder {
                            color: rgba(34, 34, 96, 0.35);
                        }
                    }

                    .eye-btn {
                        position: absolute;
                        right: 0.9rem;
                        background: transparent;
                        border: none;
                        color: rgba(34, 34, 96, 0.4);
                        cursor: pointer;
                        font-size: 1rem;
                        padding: 0.2rem;

                        &:hover {
                            color: #222260;
                        }
                    }
                }
            }

            .submit-auth-btn {
                margin-top: 0.5rem;
                background: var(--color-accent);
                color: #fff;
                border: none;
                padding: 0.85rem;
                border-radius: 16px;
                font-family: inherit;
                font-size: 1rem;
                font-weight: 700;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 0.6rem;
                box-shadow: 0px 6px 20px rgba(245, 102, 102, 0.3);
                transition: all 0.25s ease;

                &:hover:not(:disabled) {
                    background: var(--color-green);
                    box-shadow: 0px 6px 20px rgba(66, 173, 98, 0.3);
                    transform: translateY(-2px);
                }

                &:disabled {
                    opacity: 0.7;
                    cursor: not-allowed;
                }
            }
        }

        .auth-footer {
            margin-top: 1.5rem;
            text-align: center;

            p {
                font-size: 0.88rem;
                color: rgba(34, 34, 96, 0.6);

                button {
                    background: transparent;
                    border: none;
                    color: #222260;
                    font-weight: 700;
                    cursor: pointer;
                    text-decoration: underline;

                    &:hover {
                        color: var(--color-accent);
                    }
                }
            }
        }
    }
`;

export default Auth;
