"use client";
import React from "react";
import Divider from "./common/Divider";
import MenuSection from "./common/MenuSection";
// import Community from "./community/Community";
import Groups from "./groups/Groups";
// import Messages from "./messages/Messages";
import Notifications from "./notifications/Notifications";
import Pages from "./pages/Pages";
import AddNewPage from "./AddPage/AddNewPage";
import AddNewGroup from "./AddGroup/AddNewGroup";
import UserDetails from "./useDetails/UserDetails";

export default function PersonalMenu() {
  const [addNewPage, setAddNewPage] = React.useState(false);
  const [addNewGroup, setAddNewGroup] = React.useState(false);
  return (
    <>
      <UserDetails />
      <MenuSection title="Notifications" href="">
        <Notifications />
      </MenuSection>
      <Divider />
      {/* <MenuSection title="Messages" href="">
        <Messages />
      </MenuSection> */}
      {/* <Divider /> */}
      {/* <MenuSection title="Community" href="#">
        <Community />
      </MenuSection> */}
      {/* <Divider /> */}
      <MenuSection title="Pages" href="Create Page" setAddNew={setAddNewPage}>
        <Pages />
      </MenuSection>
      <Divider />
      <MenuSection
        title="Groups"
        href="Create Group"
        setAddNew={setAddNewGroup}
      >
        <Groups />
      </MenuSection>
      {addNewPage && <AddNewPage setAddNew={setAddNewPage} />}
      {addNewGroup && <AddNewGroup setAddNew={setAddNewGroup} />}
    </>
  );
}
