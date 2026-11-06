import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Animated, { FadeInDown } from 'react-native-reanimated';

interface Mission {
  id: string;
  flightNo: string;
  aircraft: string;
  type: string;
  origin: string;
  destination: string;
  date: string;
  departure: string;
  arrival: string;
  duration: string;
  cargo: string;
  weight: string;
  status: 'scheduled';
}

const HOLIDAYS: Record<string, string> = {
  '1-26': 'Republic Day',
  '3-8': 'Maha Shivaratri',
  '3-25': 'Holi',
  '3-29': 'Good Friday',
  '4-11': 'Id-ul-Fitr',
  '4-14': 'Ambedkar Jayanti',
  '4-17': 'Ram Navami',
  '4-21': 'Mahavir Jayanti',
  '5-23': 'Buddha Purnima',
  '6-17': 'Id-ul-Zuha',
  '7-17': 'Muharram',
  '8-15': 'Independence Day',
  '8-26': 'Janmashtami',
  '9-16': 'Milad-un-Nabi',
  '10-2': 'Gandhi Jayanti',
  '10-12': 'Dussehra',
  '10-31': 'Diwali',
  '11-15': 'Guru Nanak Jayanti',
  '12-25': 'Christmas',
};

export const getHoliday = (day: number, month: number) => HOLIDAYS[`${month}-${day}`];

export const CASUAL_LEAVE_DAYS = [7, 8, 9, 10];
export const isCasualLeaveDay = (day: number, month: number, year: number) => {
  return month === 11 && year === 2026 && CASUAL_LEAVE_DAYS.includes(day);
};

// 24 illustrative BLR outbound domestic flights (7–30 November) alternating An-32 and Boeing 737-300
const FLIGHT_PLAN: [number, 'AN-32' | 'B737-300', string, string, string, string, string, string, string][] = [
  [7, 'AN-32', 'Goa', '06:20', '08:05', '1h 45m', 'Medical supplies', '1,250 kg', 'IAF-SIM-321'],
  [8, 'B737-300', 'New Delhi', '09:10', '11:55', '2h 45m', 'Personnel movement', '5,800 kg', 'IAF-SIM-731'],
  [9, 'AN-32', 'Hyderabad', '07:35', '09:00', '1h 25m', 'Priority cargo', '950 kg', 'IAF-SIM-322'],
  [10, 'B737-300', 'Mumbai', '14:20', '16:50', '2h 30m', 'Logistics support', '6,200 kg', 'IAF-SIM-732'],
  [11, 'AN-32', 'Kochi', '08:15', '10:05', '1h 50m', 'Relief materials', '1,600 kg', 'IAF-SIM-323'],
  [12, 'B737-300', 'Pune', '06:45', '08:25', '1h 40m', 'Equipment transfer', '4,900 kg', 'IAF-SIM-733'],
  [13, 'AN-32', 'Kolkata', '08:30', '11:45', '3h 15m', 'Medical supplies', '1,400 kg', 'IAF-SIM-324'],
  [14, 'B737-300', 'Chennai', '07:05', '08:05', '1h 00m', 'Personnel movement', '5,200 kg', 'IAF-SIM-734'],
  [15, 'AN-32', 'Jaipur', '06:15', '09:15', '3h 00m', 'Priority cargo', '1,100 kg', 'IAF-SIM-325'],
  [16, 'B737-300', 'Mangaluru', '09:00', '10:05', '1h 05m', 'Logistics support', '4,800 kg', 'IAF-SIM-735'],
  [17, 'AN-32', 'Visakhapatnam', '06:30', '08:25', '1h 55m', 'Relief materials', '1,450 kg', 'IAF-SIM-326'],
  [18, 'B737-300', 'Ahmedabad', '11:40', '14:20', '2h 40m', 'Personnel movement', '5,700 kg', 'IAF-SIM-736'],
  [19, 'AN-32', 'Coimbatore', '07:50', '09:05', '1h 15m', 'Priority cargo', '900 kg', 'IAF-SIM-327'],
  [20, 'B737-300', 'Lucknow', '13:15', '15:55', '2h 40m', 'Logistics support', '6,100 kg', 'IAF-SIM-737'],
  [21, 'AN-32', 'Tirupati', '08:40', '09:50', '1h 10m', 'Medical supplies', '720 kg', 'IAF-SIM-328'],
  [22, 'B737-300', 'Nagpur', '07:15', '09:10', '1h 55m', 'Equipment transfer', '5,100 kg', 'IAF-SIM-738'],
  [23, 'AN-32', 'Guwahati', '06:00', '09:40', '3h 40m', 'Relief materials', '1,500 kg', 'IAF-SIM-329'],
  [24, 'B737-300', 'Belagavi', '07:20', '08:20', '1h 00m', 'Personnel movement', '4,600 kg', 'IAF-SIM-739'],
  [25, 'AN-32', 'Bhopal', '07:00', '09:20', '2h 20m', 'Priority cargo', '1,200 kg', 'IAF-SIM-330'],
  [26, 'B737-300', 'Hubballi', '09:15', '10:15', '1h 00m', 'Logistics support', '4,500 kg', 'IAF-SIM-740'],
  [27, 'AN-32', 'Thiruvananthapuram', '06:40', '08:35', '1h 55m', 'Medical supplies', '1,050 kg', 'IAF-SIM-331'],
  [28, 'B737-300', 'Chandigarh', '10:05', '13:00', '2h 55m', 'Personnel movement', '6,300 kg', 'IAF-SIM-741'],
  [29, 'AN-32', 'Vijayawada', '08:00', '09:20', '1h 20m', 'Equipment transfer', '920 kg', 'IAF-SIM-332'],
  [30, 'B737-300', 'Patna', '12:10', '15:05', '2h 55m', 'Logistics support', '5,600 kg', 'IAF-SIM-742'],
];

const NOVEMBER_MISSIONS: Mission[] = FLIGHT_PLAN.map(([day, aircraft, destination, departure, arrival, duration, cargo, weight, flightNo]) => ({
  id: `M-${String(day).padStart(2, '0')}`,
  flightNo,
  aircraft: aircraft === 'AN-32' ? 'Antonov An-32' : 'Boeing 737-300',
  type: aircraft === 'AN-32' ? 'Tactical transport' : 'Strategic transport',
  origin: 'BLR · Bengaluru',
  destination,
  date: `2026-11-${String(day).padStart(2, '0')}`,
  departure,
  arrival,
  duration,
  cargo,
  weight,
  status: 'scheduled' as const,
}));

const getInitialDateStr = () =>
  new Date().toLocaleDateString('en-IN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

const getInitialTimeStr = () =>
  new Date().toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

export default function MissionsPage() {
  const [currentDate, setCurrentDate] = useState<string>(getInitialDateStr);
  const [currentTime, setCurrentTime] = useState<string>(getInitialTimeStr);
  const [selectedMonth, setSelectedMonth] = useState(new Date(2026, 10, 1));
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const missions = NOVEMBER_MISSIONS;

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      setCurrentDate(
        now.toLocaleDateString('en-IN', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })
      );
      setCurrentTime(
        now.toLocaleTimeString('en-IN', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        })
      );
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const monthDays = getDaysInMonth(selectedMonth);
  const firstDay = getFirstDayOfMonth(selectedMonth);
  const calendarDays = [];

  for (let i = 0; i < firstDay; i++) {
    calendarDays.push(null);
  }
  for (let i = 1; i <= monthDays; i++) {
    calendarDays.push(i);
  }

  const getDateKey = (day: number) => `${selectedMonth.getFullYear()}-${String(selectedMonth.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  const monthMissions = missions.filter((mission) => mission.date.startsWith(`${selectedMonth.getFullYear()}-${String(selectedMonth.getMonth() + 1).padStart(2, '0')}`));
  const visibleMissions = monthMissions.filter((mission) => !selectedDay || mission.date === selectedDay);
  const formatMissionDate = (date: string) => {
    const [year, month, day] = date.split('-').map(Number);
    return new Date(year, month - 1, day).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' });
  };

  const previousMonth = () => {
    setSelectedMonth(
      new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() - 1)
    );
  };

  const nextMonth = () => {
    setSelectedMonth(
      new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() + 1)
    );
  };

  const selectedDayParts = selectedDay ? selectedDay.split('-').map(Number) : null;
  const isSelectedDayLeave = selectedDayParts ? isCasualLeaveDay(selectedDayParts[2], selectedDayParts[1], selectedDayParts[0]) : false;
  const selectedDayHoliday = selectedDayParts ? getHoliday(selectedDayParts[2], selectedDayParts[1]) : undefined;

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Pilot Info Header */}
        <View style={styles.headerCard}>
          <View style={styles.pilotSection}>
            <MaterialCommunityIcons name="account-circle" size={40} color="#38BDF8" />
            <View style={styles.pilotInfo}>
              <Text style={styles.pilotName}>Rishabh Tripathi</Text>
              <Text style={styles.pilotRank}>First Officer · An-32 / Boeing 737-300</Text>
            </View>
          </View>
          <View style={styles.dateTimeSection}>
            <Text style={styles.dateText}>{currentDate}</Text>
            <Text style={styles.timeText}>{currentTime}</Text>
          </View>
        </View>

        {/* Mission Calendar Section */}
        <View style={styles.calendarSection}>
          <View style={styles.calendarHeader}>
            <TouchableOpacity onPress={() => { setSelectedDay(null); previousMonth(); }} accessibilityLabel="Previous month">
              <MaterialCommunityIcons name="chevron-left" size={28} color="#38BDF8" />
            </TouchableOpacity>
            <Text style={styles.calendarTitle}>
              {selectedMonth.toLocaleDateString('en-IN', {
                month: 'long',
                year: 'numeric',
              })}
            </Text>
            <TouchableOpacity onPress={() => { setSelectedDay(null); nextMonth(); }} accessibilityLabel="Next month">
              <MaterialCommunityIcons name="chevron-right" size={28} color="#38BDF8" />
            </TouchableOpacity>
          </View>

          <View style={styles.weekDaysContainer}>
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <Text key={day} style={styles.weekDayText}>
                {day}
              </Text>
            ))}
          </View>

          <View style={styles.calendarGrid}>
            {calendarDays.map((day, index) => {
              const now = new Date();
              const isToday = day === now.getDate() && selectedMonth.getMonth() === now.getMonth() && selectedMonth.getFullYear() === now.getFullYear();
              const dayKey = day ? getDateKey(day) : '';
              const flightCount = day ? monthMissions.filter((mission) => mission.date === dayKey).length : 0;
              const isSelected = dayKey === selectedDay;
              const monthNum = selectedMonth.getMonth() + 1;
              const yearNum = selectedMonth.getFullYear();
              const holidayName = day ? getHoliday(day, monthNum) : undefined;
              const isHoliday = Boolean(holidayName);
              const isLeave = day ? isCasualLeaveDay(day, monthNum, yearNum) : false;

              return day ? (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.calendarDay,
                    isToday && styles.todayDay,
                    isLeave && styles.leaveDay,
                    isHoliday && styles.holidayDay,
                    isSelected && styles.selectedDay,
                  ]}
                  onPress={() => setSelectedDay(isSelected ? null : dayKey)}
                  accessibilityRole="button"
                  accessibilityLabel={`${day} ${selectedMonth.toLocaleDateString('en-IN', { month: 'long' })}${isLeave ? ', Casual Leave' : ''}${isHoliday ? `, Holiday: ${holidayName}` : ''}${flightCount ? `, ${flightCount} scheduled flight` : ', no scheduled flights'}`}
                >
                  <Text
                    style={[
                      styles.dayText,
                      isToday && styles.todayText,
                      isLeave && styles.leaveText,
                      isHoliday && styles.holidayText,
                      isSelected && styles.selectedDayText,
                    ]}
                  >
                    {day}
                  </Text>
                  <View style={styles.markerContainer}>
                    {flightCount > 0 && <MaterialCommunityIcons name="airplane" size={10} color="#38BDF8" />}
                    {isLeave && <MaterialCommunityIcons name="bed" size={10} color="#FFD700" />}
                    {isHoliday && <View style={styles.holidayDot} />}
                  </View>
                </TouchableOpacity>
              ) : <View key={index} style={styles.calendarDay} />;
            })}
          </View>
          <View style={styles.calendarLegend}>
            <View style={styles.legendItem}>
              <MaterialCommunityIcons name="airplane" size={14} color="#38BDF8" />
              <Text style={styles.legendText}>Flight</Text>
            </View>
            <View style={styles.legendItem}>
              <MaterialCommunityIcons name="bed" size={14} color="#FFD700" />
              <Text style={styles.legendText}>Casual leave</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={styles.holidayDot} />
              <Text style={styles.legendText}>Holiday</Text>
            </View>
            <Text style={styles.legendText}>Tap to filter</Text>
          </View>
        </View>

        {/* Upcoming Missions Section */}
        <View style={styles.missionsSection}>
          <View style={styles.sectionHeading}>
            <View>
              <Text style={styles.sectionTitle}>Flight schedule</Text>
              <Text style={styles.sectionSubtitle}>{selectedDay ? formatMissionDate(selectedDay) : 'BLR outbound · 7–30 November 2026'}</Text>
            </View>
            <View style={styles.countBadge}><MaterialCommunityIcons name="airplane-clock" size={16} color="#38BDF8" /><Text style={styles.countText}>{visibleMissions.length}</Text></View>
          </View>
          
          <View style={styles.scheduleNote}>
            <MaterialCommunityIcons name="information-outline" size={17} color="#FBBF24" />
            <Text style={styles.scheduleNoteText}>Illustrative domestic training and logistics schedule. All times are IST; departures originate at Bengaluru (BLR).</Text>
          </View>

          {/* Casual Leave Notification Banner if selected date is on Casual Leave */}
          {isSelectedDayLeave && (
            <View style={styles.leaveBanner}>
              <MaterialCommunityIcons name="bed" size={22} color="#FFD700" />
              <View style={{ flex: 1 }}>
                <Text style={styles.leaveBannerTitle}>Officer on Casual Leave (CL)</Text>
                <Text style={styles.leaveBannerSubtitle}>Approved Casual Leave (7–10 Nov 2026). Roster covered by designated standby co-pilot.</Text>
              </View>
              <View style={styles.leaveBadge}>
                <Text style={styles.leaveBadgeText}>CL Approved</Text>
              </View>
            </View>
          )}

          {/* Holiday Notification Banner if selected date is a gazetted holiday */}
          {selectedDayHoliday && (
            <View style={styles.holidayBanner}>
              <MaterialCommunityIcons name="star-circle-outline" size={22} color="#FF4D4D" />
              <View style={{ flex: 1 }}>
                <Text style={styles.holidayBannerTitle}>Gazetted Holiday: {selectedDayHoliday}</Text>
                <Text style={styles.holidayBannerSubtitle}>Essential defence logistics and training sorties operate as scheduled.</Text>
              </View>
            </View>
          )}

          <View style={styles.missionsGrid}>
            {visibleMissions.length ? visibleMissions.map((mission, index) => {
              const [y, m, d] = mission.date.split('-').map(Number);
              const isMissionLeave = isCasualLeaveDay(d, m, y);

              return (
                <Animated.View key={mission.id} entering={FadeInDown.delay(index * 55).duration(350)} style={styles.missionCard}>
                  {isMissionLeave && (
                    <View style={styles.leaveCardTag}>
                      <MaterialCommunityIcons name="bed" size={14} color="#FFD700" />
                      <Text style={styles.leaveCardTagText}>Casual Leave (7–10 Nov) · Relieved by Standby Crew</Text>
                    </View>
                  )}

                  <View style={styles.missionHeaderRow}>
                    <View style={styles.missionIdSection}>
                      <Text style={styles.missionId}>{mission.flightNo}  ·  {mission.id}</Text>
                      <Text style={styles.missionType}>{mission.aircraft} · {mission.type}</Text>
                    </View>
                    <View style={styles.statusBadge}>
                      <MaterialCommunityIcons name="airplane" size={16} color="#38BDF8" />
                      <Text style={styles.statusText}>Scheduled</Text>
                    </View>
                  </View>

                  <View style={styles.missionRoute}>
                    <View style={styles.routePoint}><MaterialCommunityIcons name="airplane-takeoff" size={18} color="#38BDF8" /><Text style={styles.routeText}>{mission.origin}</Text></View>
                    <MaterialCommunityIcons name="arrow-right" size={17} color="#64748B" />
                    <View style={styles.routePoint}><MaterialCommunityIcons name="map-marker-outline" size={18} color="#38BDF8" /><Text style={styles.routeText}>{mission.destination}</Text></View>
                  </View>

                  <View style={styles.missionDetails}>
                    <View style={styles.detailItem}><MaterialCommunityIcons name="calendar-month-outline" size={16} color="#38BDF8" /><Text style={styles.detailText}>{formatMissionDate(mission.date)}</Text></View>
                    <View style={styles.detailItem}><MaterialCommunityIcons name="clock-time-four-outline" size={16} color="#38BDF8" /><Text style={styles.detailText}>{mission.departure}–{mission.arrival} IST</Text></View>
                    <View style={styles.detailItem}><MaterialCommunityIcons name="timer-outline" size={16} color="#38BDF8" /><Text style={styles.detailText}>{mission.duration}</Text></View>
                  </View>

                  <View style={styles.cargoSection}>
                    <View style={styles.cargoItem}>
                      <MaterialCommunityIcons name="briefcase-outline" size={16} color="#38BDF8" />
                      <Text style={styles.cargoType}>{mission.cargo}</Text>
                    </View>
                    <View style={styles.weightBadge}>
                      <MaterialCommunityIcons name="weight-kilogram" size={14} color="#ffffff" />
                      <Text style={styles.weightText}>{mission.weight}</Text>
                    </View>
                  </View>

                  <View style={styles.cardFooter}>
                    <MaterialCommunityIcons name="shield-check-outline" size={15} color="#94A3B8" />
                    <Text style={styles.footerText}>Schedule ref · {mission.id}</Text>
                    <Text style={styles.footerText}>Domestic sector</Text>
                  </View>
                </Animated.View>
              );
            }) : (
              <View style={styles.emptyState}>
                <MaterialCommunityIcons name="calendar-blank-outline" size={30} color="#64748B" />
                <Text style={styles.emptyTitle}>No flights scheduled</Text>
                <Text style={styles.emptyText}>Choose a marked date or clear the date filter to view the monthly schedule.</Text>
                {selectedDay && <TouchableOpacity style={styles.clearFilterButton} onPress={() => setSelectedDay(null)}><Text style={styles.clearFilterText}>Show all November flights</Text></TouchableOpacity>}
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  scrollContainer: {
    paddingVertical: 20,
    paddingHorizontal: 10,
    paddingBottom: 100,
  },

  // Header Card
  headerCard: {
    backgroundColor: '#1E293B',
    borderRadius: 20,
    padding: 20,
    marginBottom: 30,
    borderWidth: 1,
    borderColor: '#334155',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 12,
  },
  pilotSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  pilotInfo: {
    marginLeft: 15,
    flex: 1,
  },
  pilotName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#F1F5F9',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  pilotRank: {
    fontSize: 12,
    color: '#38BDF8',
    fontWeight: '600',
    marginTop: 4,
  },
  dateTimeSection: {
    borderTopWidth: 1,
    borderTopColor: '#334155',
    paddingTop: 12,
  },
  dateText: {
    fontSize: 13,
    color: '#94A3B8',
    marginBottom: 4,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
  },
  timeText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#38BDF8',
  },

  // Calendar Styles
  calendarSection: {
    backgroundColor: '#1E293B',
    borderRadius: 20,
    padding: 15,
    marginBottom: 5,
    borderWidth: 1,
    borderColor: '#334155',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
  },
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  calendarTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#F1F5F9',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  weekDaysContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
  },
  weekDayText: {
    width: '14.28%',
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '600',
    color: '#38BDF8',
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  calendarDay: {
    width: '14.28%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginBottom: 5,
  },
  todayDay: {
    backgroundColor: 'rgba(0, 208, 132, 0.2)',
    borderWidth: 1.5,
    borderColor: '#00D084',
  },
  selectedDay: {
    backgroundColor: 'rgba(56, 189, 248, 0.2)',
    borderWidth: 1.5,
    borderColor: '#38BDF8',
  },
  selectedDayText: {
    color: '#F1F5F9',
    fontWeight: 'bold',
  },
  markerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    marginTop: 3,
  },
  flightDot: {
    width: 4.5,
    height: 4.5,
    borderRadius: 2.5,
    backgroundColor: '#38BDF8',
  },
  leaveDot: {
    width: 4.5,
    height: 4.5,
    borderRadius: 2.5,
    backgroundColor: '#FFD700',
  },
  holidayDot: {
    width: 4.5,
    height: 4.5,
    borderRadius: 2.5,
    backgroundColor: '#FF4D4D',
  },
  calendarLegend: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#334155',
    marginTop: 8,
    paddingTop: 12,
    flexWrap: 'wrap',
    gap: 8,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendText: {
    color: '#94A3B8',
    fontSize: 11,
  },
  dayText: {
    fontSize: 12,
    color: '#94A3B8',
    fontWeight: '500',
  },
  todayText: {
    color: '#00D084',
    fontWeight: 'bold',
  },
  leaveDay: {
    backgroundColor: 'rgba(255, 215, 0, 0.15)',
    borderColor: '#FFD700',
    borderWidth: 1,
  },
  leaveText: {
    color: '#FFD700',
    fontWeight: 'bold',
  },
  holidayDay: {
    backgroundColor: 'rgba(255, 77, 77, 0.15)',
    borderColor: '#FF4D4D',
    borderWidth: 1,
  },
  holidayText: {
    color: '#FF4D4D',
    fontWeight: 'bold',
  },

  // Missions Section
  missionsSection: {
    marginBottom: 40,
  },
  sectionHeading: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 18,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#38BDF8',
    textAlign: 'left',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  sectionSubtitle: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 4,
  },
  countBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(56, 189, 248, 0.12)',
    borderRadius: 12,
    paddingHorizontal: 11,
    paddingVertical: 7,
  },
  countText: {
    color: '#F1F5F9',
    fontSize: 13,
    fontWeight: '700',
  },
  scheduleNote: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 9,
    backgroundColor: 'rgba(251, 191, 36, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(251, 191, 36, 0.2)',
    borderRadius: 12,
    padding: 11,
    marginBottom: 14,
  },
  scheduleNoteText: {
    color: '#CBD5E1',
    fontSize: 11,
    lineHeight: 16,
    flex: 1,
  },
  leaveBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.4)',
    borderRadius: 12,
    padding: 12,
    marginBottom: 14,
  },
  leaveBannerTitle: {
    color: '#FFD700',
    fontSize: 13,
    fontWeight: 'bold',
  },
  leaveBannerSubtitle: {
    color: '#CBD5E1',
    fontSize: 11,
    marginTop: 2,
  },
  leaveBadge: {
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#FFD700',
  },
  leaveBadgeText: {
    color: '#FFD700',
    fontSize: 10,
    fontWeight: 'bold',
  },
  holidayBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: 'rgba(255, 77, 77, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 77, 77, 0.4)',
    borderRadius: 12,
    padding: 12,
    marginBottom: 14,
  },
  holidayBannerTitle: {
    color: '#FF4D4D',
    fontSize: 13,
    fontWeight: 'bold',
  },
  holidayBannerSubtitle: {
    color: '#CBD5E1',
    fontSize: 11,
    marginTop: 2,
  },
  leaveCardTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255, 215, 0, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.3)',
    borderRadius: 8,
    paddingHorizontal: 9,
    paddingVertical: 5,
    marginBottom: 10,
  },
  leaveCardTagText: {
    color: '#FFD700',
    fontSize: 11,
    fontWeight: '600',
  },
  missionsGrid: {
    gap: 15,
  },
  missionCard: {
    backgroundColor: '#1E293B',
    borderRadius: 15,
    padding: 15,
    borderWidth: 1,
    borderColor: '#334155',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  missionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  missionIdSection: {
    flex: 1,
  },
  missionId: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#38BDF8',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  missionType: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 2,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: 'rgba(56, 189, 248, 0.5)',
    backgroundColor: 'rgba(56, 189, 248, 0.08)',
    gap: 6,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#38BDF8',
  },
  missionRoute: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    gap: 8,
  },
  routePoint: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    flexShrink: 1,
  },
  routeText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#F1F5F9',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  missionDetails: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexBasis: '45%',
  },
  detailText: {
    fontSize: 12,
    color: '#94A3B8',
    flex: 1,
  },
  cargoSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#334155',
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderTopWidth: 1,
    borderTopColor: '#334155',
    paddingTop: 10,
  },
  footerText: {
    color: '#94A3B8',
    fontSize: 10,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 28,
    paddingHorizontal: 20,
    backgroundColor: '#1E293B',
    borderColor: '#334155',
    borderWidth: 1,
    borderRadius: 15,
    gap: 8,
  },
  emptyTitle: {
    color: '#F1F5F9',
    fontSize: 15,
    fontWeight: '700',
  },
  emptyText: {
    color: '#94A3B8',
    fontSize: 12,
    lineHeight: 18,
    textAlign: 'center',
  },
  clearFilterButton: {
    marginTop: 8,
    paddingVertical: 9,
    paddingHorizontal: 13,
    borderRadius: 9,
    backgroundColor: 'rgba(56, 189, 248, 0.15)',
  },
  clearFilterText: {
    color: '#38BDF8',
    fontWeight: '700',
    fontSize: 12,
  },
  cargoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  cargoType: {
    fontSize: 12,
    color: '#F1F5F9',
    fontWeight: '500',
    flex: 1,
  },
  weightBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(56, 189, 248, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    gap: 5,
  },
  weightText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#38BDF8',
  },
  detailsButton: {
    flexDirection: 'row',
    backgroundColor: '#38BDF8',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  detailsButtonText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#0a0f1a',
  },
  restDayCard: {
    borderColor: 'rgba(255, 77, 77, 0.3)',
    backgroundColor: 'rgba(255, 77, 77, 0.05)',
  },
});
