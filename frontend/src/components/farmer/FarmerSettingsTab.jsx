import React from 'react';
import FarmerIdentityForm from './FarmerIdentityForm';
import FarmerSecurityForm from './FarmerSecurityForm';

/**
 * FarmerSettingsTab
 * Container tab organizing Farm Identity settings and Stall Master Security credentials.
 */
export default function FarmerSettingsTab({
  farmSettings,
  setFarmSettings,
  onSaveFarmSettings,
  farmSaving = false,
}) {
  return (
    <div className="space-y-6">
      <FarmerIdentityForm
        farmSettings={farmSettings}
        setFarmSettings={setFarmSettings}
        onSubmit={onSaveFarmSettings}
        loading={farmSaving}
      />
      <FarmerSecurityForm />
    </div>
  );
}
