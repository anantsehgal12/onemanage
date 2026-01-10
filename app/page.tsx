'use client'

import { useOrganizationList } from "@clerk/nextjs";

export default function Page(){
  const { isLoaded, setActive, userMemberships } = useOrganizationList({
    userMemberships: {
      infinite: true, // Useful for users with many organizations
    },
  });

  if (!isLoaded) return null;

  return (
    <div>
      {userMemberships.data?.map((mem) => (
        <button 
          key={mem.organization.id} 
          onClick={() => setActive({ organization: mem.organization.id })}
        >
          {mem.organization.name}
        </button>
      ))}
      
      {/* Optional: Add button to switch to Personal Account */}
      <button onClick={() => setActive({ organization: null })}>
        Personal Account
      </button>
    </div>
  );
};
