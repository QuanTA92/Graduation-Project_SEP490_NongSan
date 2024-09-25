'use client';
import  Container  from "../Container";
import UserMenu from "./UserMenu";

const Navbar = () => {
    return  (
        
                <Container>
                    <div className="
                    flex
                    flex-row
                    items-center
                    justify-between
                    gap-3
                    md:gap-0">
                        {/* Xóa thành phần Search */}
                        <UserMenu />
                    </div>
                </Container>
    );
}

export default Navbar;
