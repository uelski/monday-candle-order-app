import React from "react";
import { Skeleton, Box } from "@vibe/core";

const OrderFormSkeleton = () => {
  return (
    <Box className="order-form-container">
      <Skeleton type="text" size="h2" className="form-title" />

      <div className="form-grid">
        <div className="form-row-top">
          <div className="form-field">
            <Skeleton type="text" size="small" />
            <Skeleton type="rectangle" height={40} />
          </div>
          <div className="form-field">
            <Skeleton type="text" size="small" />
            <Skeleton type="rectangle" height={40} />
          </div>
          <div className="form-field">
            <Skeleton type="text" size="small" />
            <Skeleton type="rectangle" height={40} />
          </div>
        </div>

        <div className="form-row-bottom">
          <div className="form-field">
            <Skeleton type="text" size="small" />
            <Skeleton type="rectangle" height={40} />
          </div>
        </div>
      </div>

      <Skeleton type="rectangle" width={120} height={40} className="form-actions" />
    </Box>
  );
};

export default OrderFormSkeleton;
