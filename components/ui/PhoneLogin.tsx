/* eslint-disable @next/next/no-img-element */
import { ConfirmationResult, RecaptchaVerifier } from 'firebase/auth';
import { firebaseAuth } from '@/components/firebase/firebaseAuth';
import { useEffect, useState } from 'react';
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
    loginWithPhoneNumber,
    sendVerificationCode,
    useSendVerificationCodeLoading,
    useVerifyPhoneNumberLoading,
    verifyPhoneNumber,
} from '../redux/auth/verifyPhoneNumber';

interface IPhoneInput{
    id?:string;
}

const PhoneInput = ({id}:IPhoneInput) => {
    const captchaContainerId = `recaptcha-container-${id}`
    const dispatch = useAppDispatch();
    const auth = useAuth();
    const [phoneNumber, setPhoneNumber] = useState('');
    const [OTPCode, setOTPCode] = useState('');
    const [show, setShow] = useState(false);

    const sendVerificationLoading = useSendVerificationCodeLoading();
    const verifyPhoneNumberLoading = useVerifyPhoneNumberLoading();
    const [recaptcha, setRecaptcha] = useState<RecaptchaVerifier | null>(null);
    const [recaptchaResolved, setRecaptchaResolved] = useState(false);
    const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult|null>(null);

    const handleSignIn = async () => {
        dispatch(
            loginWithPhoneNumber({
                phoneNumber,
                auth,
                recaptcha,
                recaptchaResolved,
                callback: (result) => {
                    if (result.type === 'error') {
                        setRecaptchaResolved(false);
                        return;
                    }
                    setConfirmationResult(result.confirmationResult);
                    setShow(true);
                },
            })
        );
    };

    // Validating the filled OTP by user
    const ValidateOtp = async () => {
        if (OTPCode===null) return;
        const user = await confirmationResult?.confirm(OTPCode)
    };

       // generating the recaptcha on page render
       useEffect(() => {
           console.log(captchaContainerId)
        const captcha = new RecaptchaVerifier(firebaseAuth, captchaContainerId, {
            size: 'normal',
            callback: () => {
                setRecaptchaResolved(true);
            },

            'expired-callback': () => {
                setRecaptchaResolved(false);
                dispatch(
                    showToast({
                        message: 'Recaptcha Expired, please verify it again',
                        type: 'info',
                    })
                );
            },
        });

        captcha.render();

        setRecaptcha(captcha);
    }, []);

    return (
        <div className="flex items-center justify-center min-h-full px-4 sm:px-6 lg:px-8">
            <div className="w-full max-w-md">
                <div className="max-w-xl w-full rounded overflow-hidden py-2 shadow-lg px-4">
                    <div className="px-4 flex pb-10 gap-4 flex-col">
                        <Input
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            placeholder="phone number"
                            type="text"
                        />
                        <LoadingButton
                            onClick={handleSignIn}
                            loading={sendVerificationLoading}
                            loadingText="Sending OTP"
                        >
                            Send OTP
                        </LoadingButton>
                    </div>  
                    <div id={captchaContainerId} />                
                    <Modal show={show} setShow={setShow}>
                        <div className="max-w-xl w-full bg-white py-6 rounded-lg">
                            <h2 className="text-lg font-semibold text-center mb-10">
                                Enter Code to Verify
                            </h2>
                            <div className="px-4 flex items-center gap-4 pb-10">
                                <Input
                                    value={OTPCode}
                                    type="text"
                                    placeholder="Enter your OTP"
                                    onChange={(e) => setOTPCode(e.target.value)}
                                />

                                <LoadingButton
                                    onClick={ValidateOtp}
                                    loading={verifyPhoneNumberLoading}
                                    loadingText="Verifying..."
                                >
                                    Verify
                                </LoadingButton>
                            </div>
                        </div>
                    </Modal>
                </div>
            </div>
            <ToastBox />
        </div>
    );
};

export default PhoneInput;
