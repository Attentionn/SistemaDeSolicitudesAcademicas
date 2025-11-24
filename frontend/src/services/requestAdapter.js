// Adapter para normalizar solicitudes (accommodations y absences)
// Unifica campo 'status' = pending|approved|rejected
// Mantiene propiedades originales para render.

const STATUS_LABELS = {
  pending: 'Pendiente',
  approved: 'Aprobada',
  rejected: 'Rechazada'
};

const STATUS_BADGES = {
  pending: 'bg-yellow-100 text-yellow-800',
  approved: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800'
};

export function adaptRequest(raw) {
  if (!raw || typeof raw !== 'object') return raw;
  const isAccommodation = raw.type === 'accommodation' || (raw.status && raw.type !== 'absence');
  const isAbsence = raw.type === 'absence' || (!!raw.tipo && !raw.status);

  let unifiedStatus;
  if (isAccommodation) {
    // Usa status directo
    if (['pending', 'approved', 'rejected'].includes(raw.status)) {
      unifiedStatus = raw.status;
    } else {
      unifiedStatus = 'pending';
    }
  } else if (isAbsence) {
    // Mapear tipo a estado
    switch (raw.tipo) {
      case 'prevista':
        unifiedStatus = 'pending';
        break;
      case 'justificada':
        unifiedStatus = 'approved';
        break;
      case 'injustificada':
        unifiedStatus = 'rejected';
        break;
      default:
        unifiedStatus = 'pending';
    }
  } else {
    unifiedStatus = 'pending';
  }

  const kind = isAccommodation ? 'accommodation' : 'absence';

  return {
    ...raw,
    kind,
    status: unifiedStatus,
    statusLabel: STATUS_LABELS[unifiedStatus],
    badgeClass: STATUS_BADGES[unifiedStatus]
  };
}

export function adaptRequests(list) {
  if (!Array.isArray(list)) return [];
  return list.map(adaptRequest);
}

export function countByStatus(list) {
  return list.reduce(
    (acc, r) => {
      acc.total++;
      acc[r.status] = (acc[r.status] || 0) + 1;
      return acc;
    },
    { total: 0, pending: 0, approved: 0, rejected: 0 }
  );
}
