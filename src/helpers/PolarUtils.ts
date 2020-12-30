import CompletedTraining from "../entity/CompletedTraining";
import MetaData from "../entity/MetaData";

export function getTimeInTrainingZone(trainingZones: any, trackpoints: any[]) {
  trackpoints.forEach((trackpoint: any) => {
    const trainingZone = trainingZones.find((zone: any) => {
      return (
        trackpoint.heart_rate_bpm > zone.minHr &&
        trackpoint.heart_rate_bpm < zone.maxHr
      );
    });

    if (trainingZone !== undefined) {
      if (trainingZone.timeInZone === undefined) {
        trainingZone.timeInZone = 0;
      }
      trainingZone.timeInZone++;
    }
  });

  const TimeInZoneObject = {};
  trainingZones.forEach((zone) => {
    if (zone.timeInZone) {
      TimeInZoneObject[zone.zoneType] = zone.timeInZone;
    } else {
      TimeInZoneObject[zone.zoneType] = 0;
    }
  });

  return TimeInZoneObject;
}

export function tranferPolarTrainingToCompletedTraining(
  polarTraining: any,
  polaruser: any,
  userTrainingZones: any
) {
  const completedTraining: CompletedTraining = new CompletedTraining();
  completedTraining.dateCompleted = polarTraining["start-time"];
  completedTraining.source = "POLAR";
  completedTraining.title = "POLAR " + polarTraining.sport;
  completedTraining.polarData = new MetaData(JSON.stringify(polarTraining));
  completedTraining.athlete = polaruser.user;
  completedTraining.duration = polarTraining.duration;
  completedTraining.distance = polarTraining.distance;
  completedTraining.calories = polarTraining.calories;
  completedTraining.avgHr = polarTraining["heart-rate"].average;
  completedTraining.maxHr = polarTraining["heart-rate"].maximum;

  completedTraining.timeInZones = JSON.stringify(
    getTimeInTrainingZone(userTrainingZones, polarTraining.tcx)
  );

  if (new Date(polarTraining["start-time"]).getHours() <= 12) {
    completedTraining.period = "VM";
  } else {
    completedTraining.period = "NM";
  }

  return completedTraining;
}
