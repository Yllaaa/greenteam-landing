"use client";
import { useEffect, useState } from "react";

import { getGroupItems, GroupsResponse } from "./groups.data";

import styles from "./groups.module.scss";
import Item from "./Item";


function Groups() {
  const [groupsArray, setGroupsArray] = useState<GroupsResponse>([]);
useEffect(()=>{

  getGroupItems().then((res) => {
    setGroupsArray(res);
  });
},[])

  return (
    <div className={styles.groupsContainer}>
      <div className={styles.groups}>
        {groupsArray.map((group, index) => (
          <Item key={index} {...group} />
        ))}
      </div>
    </div>
  );
}

export default Groups;
