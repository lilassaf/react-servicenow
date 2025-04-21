import Loginform from "../../components/auth/loginform";
import { Link } from "react-router-dom";

function Login() {
  return (
    <div className="bg-gray-100 flex justify-center items-center h-screen">
      <div className="w-1/2 h-screen hidden lg:block">
        <img
          src="https://placehold.co/800x/667fff/ffffff.png?text=Your+Image&font=Montserrat"
          alt="Placeholder"
          className="object-cover w-full h-full"
        />
      </div>

      <div className="lg:p-36 md:p-52 sm:p-20 p-8 w-full lg:w-1/2">
        <h1 className="text-2xl font-semibold mb-4">Login</h1>

        <Loginform></Loginform>

        <div className="mt-6 text-blue-500 text-center">
          <Link className="hover:underline" to="/register"> Sign up Here</Link>
        </div>
      </div>
    </div>
  );
}

export default Login;
