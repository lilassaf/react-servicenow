import { useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  const location = useLocation();

  const handleLogout = async (e) => {
    e.preventDefault();
   
  };



  return (
    <>
      <aside
        className="z-30 h-lvh fixed bg-white inset-y-0 py-4 px-4 shadow-md overflow-hidden w-[15rem] shadow-xl/30"    
      >
        {/* Logo */}
        <div className="mb-20 mt-3 h-4">
          <Link to="/" className="max-w-24">
            <img
              src="../../../assets/icon/logo/logo-black-small.png"
              alt="Logo"
              className="h-8 w-auto"
            />
          </Link>
        </div>

        {/* Navigation */}
        <nav className="h-[calc(100vh-180px)] overflow-y-auto">
          <ul className="space-y-6">
            {[
              { path: '/dashboard', icon: 'dashboard', text: 'Tableau de bord' },
            ].map((item) => {
              const isActive = location.pathname.toLowerCase() === item.path.toLowerCase();
              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`flex items-center p-2 rounded-lg hover:bg-orange-100 hover:text-orange-600 ${
                      isActive ? 'bg-orange-100 text-orange-600' : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <i className={`ri-${item.icon}-line mr-3 text-lg`} />
                    <span className="font-medium">{item.text}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Déconnexion */}
        <div className="absolute bottom-0 left-0 right-0  bg-white border-t">
          <button
            onClick={handleLogout}
            className="w-full flex items-center p-4 text-gray-600 hover:bg-red-50 rounded-lg hover:bg-orange-100 hover:text-orange-600/80"
          >
            <i className="ri-shut-down-line mr-3 text-lg" />
            <span className="font-medium">Déconnexion</span>
          </button>
        </div>
      </aside>
      
      {/* Main content spacer */}
      <div className="ml-60" />
    </>
  );
};

export default Sidebar;