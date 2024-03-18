import { createAsyncThunk } from '@reduxjs/toolkit';
import {
    PhoneAuthProvider,
    RecaptchaVerifier,
    linkWithPhoneNumber,
    updatePhoneNumber,
    signInWithPhoneNumber,
    ConfirmationResult,
} from 'firebase/auth';
import { getFriendlyMessageFromFirebaseErrorCode } from './helpers';
import { showToast } from '../toast/toastSlice';
import { LoadingStateTypes } from '../types';
import { AuthContextType } from '@/components/useAuth';
import { firebaseAuth } from '@/components/firebase/firebaseAuth';
import { useSelector } from 'react-redux';
import { RootState } from '../store';

export const sendVerificationCode = createAsyncThunk(
    'sendVerificationCode',
    async (
        args: {
            phoneNumber: string;
            auth: AuthContextType;
            recaptchaResolved: boolean;
            recaptcha: RecaptchaVerifier | null;
            callback: (
                args:
                    | { type: 'success'; verificationId: string }
                    | {
                          type: 'error';
                          message: string;
                      }
            ) => void;
        },
        { dispatch }
    ) => {
        console.log('here')
        if (args.auth.type !== LoadingStateTypes.LOADED) return;
        if (!args.recaptchaResolved || !args.recaptcha) {
            dispatch(showToast({ message: 'First Resolved the Captcha', type: 'info' }));
            return;
        }
        if (args.phoneNumber.slice() === '' || args.phoneNumber.length < 10) {
            dispatch(
                showToast({
                    message: 'Enter the Phone Number and provide the country code',
                    type: 'info',
                })
            );
            return;
        }

        try {
            const sentConfirmationCode = await linkWithPhoneNumber(
                args.auth.user,
                args.phoneNumber,
                args.recaptcha
            );
            dispatch(
                showToast({
                    message: 'Verification Code has been sent to your Phone',
                    type: 'success',
                })
            );

            if (args.callback)
                args.callback({
                    type: 'success',
                    verificationId: sentConfirmationCode.verificationId,
                });
        } catch (error: any) {
            dispatch(
                showToast({
                    message: getFriendlyMessageFromFirebaseErrorCode(error.code),
                    type: 'error',
                })
            );
            if (args.callback)
                args.callback({
                    type: 'error',
                    message: getFriendlyMessageFromFirebaseErrorCode(error.code),
                });
        }
    }
);

export const useSendVerificationCodeLoading = () => {
    const loading = useSelector((state: RootState) => state.loading.sendVerificationCode);
    return loading;
};

export const verifyPhoneNumber = createAsyncThunk(
    'verifyPhoneNumber',
    async (
        args: {
            OTPCode: string;
            auth: AuthContextType;
            verificationId: string;
            callback: (
                args:
                    | { type: 'success' }
                    | {
                          type: 'error';
                          message: string;
                      }
            ) => void;
        },
        { dispatch }
    ) => {
        if (
            args.OTPCode === null ||
            !args.verificationId ||
            args.auth.type !== LoadingStateTypes.LOADED
        )
            return;

        try {
            const credential = PhoneAuthProvider.credential(args.verificationId, args.OTPCode);
            await updatePhoneNumber(args.auth.user, credential);

            firebaseAuth.currentUser?.reload();

            dispatch(
                showToast({
                    message: 'Logged in Successfully',
                    type: 'success',
                })
            );

            args.callback({ type: 'success' });
        } catch (error: any) {
            dispatch(
                showToast({
                    message: getFriendlyMessageFromFirebaseErrorCode(error.code),
                    type: 'error',
                })
            );
            if (args.callback)
                args.callback({
                    type: 'error',
                    message: getFriendlyMessageFromFirebaseErrorCode(error.code),
                });
        }
    }
);

export const loginWithPhoneNumber = createAsyncThunk(
    'loginWithPhone',
    async (args: { 
        auth: AuthContextType;
        recaptcha: RecaptchaVerifier | null;
        recaptchaResolved: boolean;
        phoneNumber: string;
        callback: (
            args:
                | { type: 'success'; confirmationResult: ConfirmationResult }
                | {
                      type: 'error';
                      message: string;
                  }
        ) => void;
    }, { dispatch }) => {
            if (!args.recaptchaResolved || !args.recaptcha) {
                dispatch(showToast({ message: 'First Resolved the Captcha', type: 'info' }));
                return;
            }
            if (args.phoneNumber.slice() === '' || args.phoneNumber.length < 10) {
                dispatch(
                    showToast({
                        message: 'Enter the Phone Number and provide the country code',
                        type: 'info',
                    })
                );
                return;
            }
        try {
             const confirmationResult = await signInWithPhoneNumber(firebaseAuth,args.phoneNumber,args.recaptcha);
             if (args.callback)
             args.callback({
                 type: 'success',
                 confirmationResult: confirmationResult,
             });
        } catch (e: any) {
            dispatch(
                showToast({
                    message: getFriendlyMessageFromFirebaseErrorCode(e.code),
                    type: 'error',
                })
            );
        }
    }
);


export const useVerifyPhoneNumberLoading = () => {
    const loading = useSelector((state: RootState) => state.loading.verifyPhoneNumber);
    return loading;
};
