import Avatarj from "@assets/sunday.jpg";
import { Badge } from 'antd';
import { Link } from 'react-router-dom';
import { Dropdown, Space } from 'antd';


function Header() {
  const items = [
    {
      label: <Link to="/profile" className="text-md"> <i class="ri-user-line mr-1"></i> Profile</Link>,
      key: '0',
    },
    {
      label: <Link to="/settings" className="text-md"> <i class="ri-settings-3-line mr-1"></i>  Settings</Link>,
      key: '1',
    },
    {
      type: 'divider',
    },
    {
      label: <div className="text-md"> <i class="ri-shut-down-line mr-1"></i> Logout</div> ,
      key: '3',
    },
  ];
  
  return (
    <header className="p-5 sticky top-0 shadow-lg flex justify-end">
      <div className="space-x-5 flex items-center">
        <div>
          <Badge count={5}>
            <i className="ri-notification-3-line text-3xl"></i>
          </Badge>
        </div>

        <Dropdown menu={{ items }} >
          <a onClick={e => e.preventDefault()}>
            <Space align="center">
              <div className="h-10 w-10 flex justify-center items-center rounded-full bg-orange-100 overflow-hidden">
                <img src={Avatarj} alt="User avatar" className="h-full w-full object-cover" />
              </div>
            </Space>
          </a>
        </Dropdown>
      </div>
    </header>
  );
}

export default Header;