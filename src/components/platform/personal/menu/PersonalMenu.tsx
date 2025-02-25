import Divider from "./common/Divider";
import MenuSection from "./common/MenuSection";
import Community from "./community/Community";
import Groups from "./groups/Groups";
import Messages from "./messages/Messages";
import Notifications from "./notifications/Notifications";
import Pages from "./pages/Pages";

export default function PersonalMenu() {
    return (
        <div>
            <MenuSection title="Notifications" href="#">
                <Notifications />
            </MenuSection>
            <Divider />
            <MenuSection title="Messages" href="#">
                <Messages />
            </MenuSection>
            <Divider />
            <MenuSection title="Community" href="#">
                <Community />
            </MenuSection>
            <Divider />
            <MenuSection title="Pages" href="#">
                <Pages />
            </MenuSection>
            <Divider />
            <MenuSection title="Groups" href="#">
                <Groups />
            </MenuSection>
        </div>
    )
}