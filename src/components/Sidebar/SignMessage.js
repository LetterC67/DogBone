import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { usePrivy } from "@privy-io/react-auth";
function SignMessage() {
    const [hasSigned, setHasSigned] = useState(false);
    const [signature, setSignature] = useState(null);
    const { signMessage, user } = usePrivy();
    const message = "This is a test message for the signing feature.";
    const uiConfig = {
        title: "Testing Signing Feature",
        description: "This is a demo to test the signing feature.",
        buttonText: "Sign the Message",
    };
    return (_jsxs("div", { children: [_jsx("button", { className: "mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 mr-2", disabled: !user?.wallet, onClick: async () => {
                    const signature = await signMessage({ message: "string" });
                    setSignature(signature);
                    setHasSigned(true);
                }, children: "Sign A Message" }), hasSigned && (_jsx("div", { children: "hallo" }))] }));
}
export default SignMessage;
