import { useContext } from "react";
import AppContext from "../context/AppContext";
import { useRouter } from 'next/router'
import ContentLoader from "../components/ContentLoader";

const privateUserRoute = Component => {
    const Auth = (props) => {
        const { user } = useContext(AppContext);
        const router = useRouter();
        console.log(user)
        if (!user?.id || user?.type !== 'user') {
            router.push('/')
            return <ContentLoader />;
        }
        return (
            <Component {...props} />
        );
    };
    if (Component.getInitialProps) {
        Auth.getInitialProps = Component.getInitialProps;
    }
    return Auth;
};

export default privateUserRoute;