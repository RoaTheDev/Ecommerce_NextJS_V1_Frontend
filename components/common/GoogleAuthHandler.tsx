import React from "react";
import {useLinkGoogleAccount} from "@/lib/queries/useAuthQueries";
import {CredentialResponse, GoogleLogin} from "@react-oauth/google";
import toast from "react-hot-toast";

export const GoogleAuthHandler: React.FC<{ onLinkGoogle: () => void }> = ({onLinkGoogle}) => {
    const linkGoogleMutation = useLinkGoogleAccount();

    const handleGoogleSuccess = (response: CredentialResponse) => {
        if (response.credential) {
            linkGoogleMutation.mutate(response.credential, {
                onSuccess: () => {
                    toast.success('Google account linked successfully');
                    onLinkGoogle();
                },
            });
        } else {
            console.error('Google link failed: No credential provided');
            toast.error('Google link failed');
        }
    };

    const handleGoogleFailure = () => {
        console.error('Google link failed');
        toast.error('Google link failed');
    };

    return (
        <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleFailure}
            shape="pill"
            theme="outline"
            text="continue_with"
        />
    );
};