import React from "react";
import { Button } from "./ui/button";
import { FcGoogle } from "react-icons/fc";
import { GrSwitch } from "react-icons/gr";
import { TbTools } from "react-icons/tb";
import { Link } from "lucide-react";

const Header = () => {
  return (
    <header className="w-full h-24 sticky flex px-48 items-center border-b border-b-accent justify-between">
      <div>
        <h1 className="font-display text-primary font-bold text-4xl">
          Bant<span className="text-secondary">uin</span>
        </h1>
      </div>
      <nav className="flex justify-between gap-2 items-center">
        <ul className="flex items-center justify-between gap-4">
          <li>
            <Button variant="link" className="">
              <Link>Ngapain di Bantuin?</Link>
            </Button>
          </li>
          <li>
            <Button variant="link" className="">
              Tentang Kami
            </Button>
          </li>
          <li>
            <Button variant="link" className="">
              Cara Kerja
            </Button>
          </li>
        </ul>
      </nav>
      <div className="flex items-center gap-2">
        <Button>
          <TbTools className="text-white" />
          Jadi Penyedia
        </Button>
        <Button variant={"outline"}>
          <FcGoogle /> Masuk
        </Button>
      </div>
    </header>
  );
};

export default Header;
