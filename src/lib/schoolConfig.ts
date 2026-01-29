export const SCHOOL_PROFILE = {
  name: 'NeuraFix Secondary School',
  classGrade: 10,
  classSection: 'A',
};

export const getClassLabel = () => `Class ${SCHOOL_PROFILE.classGrade}-${SCHOOL_PROFILE.classSection}`;
