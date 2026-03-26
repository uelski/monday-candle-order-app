import React from "react";
import { Skeleton, Box, Flex } from "@vibe/core";

const FragranceManagerSkeleton = () => {
  return (
    <Box className="fragrance-manager-container">
      <Flex justify="space-between" align="center" className="fragrance-manager-toolbar">
        <Skeleton type="text" size="small" width={120} />
        <Skeleton type="rectangle" width={140} height={32} />
      </Flex>

      <div className="fragrance-list">
        {[1, 2, 3].map((i) => (
          <div key={i} className="fragrance-card">
            <Flex justify="space-between" align="start">
              <div className="fragrance-card-info">
                <Skeleton type="text" size="small" width={160} />
                <Skeleton type="text" size="xs" width={100} />
                <Skeleton type="text" size="xs" width={240} />
              </div>
              <Flex gap="xs">
                <Skeleton type="circle" width={32} height={32} />
                <Skeleton type="circle" width={32} height={32} />
              </Flex>
            </Flex>
          </div>
        ))}
      </div>
    </Box>
  );
};

export default FragranceManagerSkeleton;
