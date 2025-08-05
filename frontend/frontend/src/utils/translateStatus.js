export const translateAdoptionStatus = (status) => {
  const translations = {
    pending: "Pendiente",
    approved: "Aprobada",
    rejected: "Rechazada",
    suspended: "Suspendida",
  };
  return translations[status] || status;
};
