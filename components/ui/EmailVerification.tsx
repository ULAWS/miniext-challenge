/* eslint-disable @next/next/no-img-element */
import { RecaptchaVerifier } from 'firebase/auth';
import { firebaseAuth } from '@/components/firebase/firebaseAuth';
import { useCallback, useEffect, useState } from 'react';
import Modal from '@/components/ui/Modal';
import { useRouter } from 'next/navigation';
import ToastBox from '@/components/ui/ToastBox';
import { useAppDispatch } from '@/components/redux/store';
import { showToast } from '@/components/redux/toast/toastSlice';
import Input from '@/components/ui/Input';
import LoadingButton from '@/components/ui/LoadingButton';
import Logout from './Logout';
import { useAuth } from '../useAuth';
import { LoadingStateTypes } from '../redux/types';
import {
    sendVerificationCode,
    useSendVerificationCodeLoading,
    useVerifyPhoneNumberLoading,
    verifyPhoneNumber,
} from '../redux/auth/verifyPhoneNumber';
import { useIsLoginWithEmailLoading, verifyEmail } from '../redux/auth/loginWithEmail';

const EmailVerification = () => {
    const dispatch = useAppDispatch();
    const auth = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [disableSubmit, setDisableSubmit] = useState(true);
    const isLoading = useIsLoginWithEmailLoading();
    const router = useRouter();

    // Sending OTP and storing id to verify it later
    const handleSendVerification = async () => {
        if (auth.type !== LoadingStateTypes.LOADED) return;

    };

    // Realtime validation to enable submit button
    useEffect(() => {
        if (email && password.length >= 6) {
            setDisableSubmit(false);
        } else {
            setDisableSubmit(true);
        }
    }, [email, password]);

    // Signing in with email and password and redirecting to home page
    const handleVerifyEmail = useCallback(async () => {

        await dispatch(
            verifyEmail({
                email,
                password,
                auth,
                callback: (result) => {
                    if (result.type === 'error') {
                        return;
                    }
                    // needed to reload auth user
                    router.refresh();
                },
            })
        );
    }, [email, password, dispatch]);

    return (
        <div className="flex items-center justify-center min-h-full px-4 py-12 sm:px-6 lg:px-8">
            <div className="w-full max-w-md space-y-8">
                <div>
                    <img
                        className="w-auto h-12 mx-auto"
                        src="https://tailwindui.com/img/logos/workflow-mark-indigo-600.svg"
                        alt="Workflow"
                    />
                    <h2 className="mt-6 text-3xl font-extrabold text-center text-gray-900">
                        Verify your email
                    </h2>
                </div>

                <div className="max-w-xl w-full rounded overflow-hidden shadow-lg py-2 px-4">
                    <div className="px-4 flex p-4 pb-10 gap-4 flex-col">
                    <Input
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Email"
                            name="email"
                            type="text"
                        />
                        <Input
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Password"
                            name="password"
                            type="password"
                        />
                         <LoadingButton
                            onClick={handleVerifyEmail}
                            disabled={disableSubmit}
                            loading={isLoading}
                        >
                           Update
                        </LoadingButton>
                    </div>
                    <div className="flex w-full flex-col">
                        <Logout />
                    </div>   
                </div>
            </div>
            <ToastBox />
        </div>
    );
};

export default EmailVerification;
