import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Animated, { FadeInDown } from 'react-native-reanimated';

interface Mission {
  id: string;
  type: string;
  origin: string;
  destination: string;
  date: string;
  time: string;
  cargo: string;
  weight: string;
  status: 'scheduled' | 'in-progress' | 'completed';
}

export default function MissionsPage() {
  const [currentDate, setCurrentDate] = useState<string>('');
  const [currentTime, setCurrentTime] = useState<string>('');
  const [missions, setMissions] = useState<Mission[]>([]);
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [randomLeaveDays, setRandomLeaveDays] = useState<number[]>([]);

  useEffect(() => {
    updateDateTime();
    generateMissions();
    setRandomLeaveDays(generateRandomLeaveDays(selectedMonth)); // Initial generation of random leaves
    const interval = setInterval(updateDateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setRandomLeaveDays(generateRandomLeaveDays(selectedMonth)); // Regenerate on month change
  }, [selectedMonth]);

  const updateDateTime = () => {
    const now = new Date();
    const dateStr = now.toLocaleDateString('en-IN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    const timeStr = now.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
    setCurrentDate(dateStr);
    setCurrentTime(timeStr);
  };

  const generateMissions = () => {
    const cargoTypes = [
      'Medical Supplies',
      'Military Equipment',
      'Food Rations',
      'Ammunition',
      'Relief Materials',
      'Electronic Components',
      'Fuel Supply',
      'Communication Devices',
    ];

    const routes = [
      { origin: 'Delhi', destination: 'Mumbai' },
      { origin: 'Bengaluru', destination: 'Guwahati' },
      { origin: 'Kolkata', destination: 'Srinagar' },
      { origin: 'Hyderabad', destination: 'Leh' },
      { origin: 'Chennai', destination: 'Jaipur' },
      { origin: 'Chandigarh', destination: 'Port Blair' },
      { origin: 'Lucknow', destination: 'Cochin' },
      { origin: 'Pune', destination: 'Imphal' },
    ];

    const statuses: Array<'scheduled' | 'in-progress' | 'completed'> = [
      'scheduled',
      'in-progress',
      'completed',
    ];

    const newMissions: Mission[] = [];
    for (let i = 0; i < 12; i++) {
      const date = new Date();
      date.setDate(date.getDate() + Math.floor(Math.random() * 30));
      const route = routes[Math.floor(Math.random() * routes.length)];
      const cargo = cargoTypes[Math.floor(Math.random() * cargoTypes.length)];
      const weight = `${Math.floor(Math.random() * 8000) + 1000} kg`;
      const status = statuses[Math.floor(Math.random() * statuses.length)];

      newMissions.push({
        id: `M${1001 + i}`,
        type: 'Cargo Transport',
        origin: route.origin,
        destination: route.destination,
        date: date.toLocaleDateString('en-IN'),
        time: `${String(Math.floor(Math.random() * 24)).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`,
        cargo,
        weight,
        status,
      });
    }
    setMissions(newMissions);
  };

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  // Fixed Gazetted Holidays in India + major festivals (approx for 2024/25)
  const HOLIDAYS_DATA: Record<string, string> = {
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

  const getHoliday = (day: number, month: number) => HOLIDAYS_DATA[`${month}-${day}`];

  const generateRandomLeaveDays = (month: Date) => {
    const daysInMonth = getDaysInMonth(month);
    const leaveDays: Set<number> = new Set();
    while (leaveDays.size < 4) {
      const randomDay = Math.floor(Math.random() * daysInMonth) + 1;
      leaveDays.add(randomDay);
    }
    return Array.from(leaveDays);
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return '#00D084';
      case 'in-progress':
        return '#FFD700';
      case 'scheduled':
        return '#4A90E2';
      default:
        return '#ffffff';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return 'check-circle';
      case 'in-progress':
        return 'progress-clock';
      case 'scheduled':
        return 'calendar-clock';
      default:
        return 'help-circle';
    }
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

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Pilot Info Header */}
        <View style={styles.headerCard}>
          <View style={styles.pilotSection}>
            <MaterialCommunityIcons name="account-circle" size={40} color="#38BDF8" />
            <View style={styles.pilotInfo}>
              <Text style={styles.pilotName}>Rishabh Tripathi</Text>
              <Text style={styles.pilotRank}>First Officer (B737/An-32)</Text>
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
            <TouchableOpacity onPress={previousMonth}>
              <MaterialCommunityIcons name="chevron-left" size={28} color="#38BDF8" />
            </TouchableOpacity>
            <Text style={styles.calendarTitle}>
              {selectedMonth.toLocaleDateString('en-IN', {
                month: 'long',
                year: 'numeric',
              })}
            </Text>
            <TouchableOpacity onPress={nextMonth}>
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
              const isToday = day === new Date().getDate() &&
                  selectedMonth.getMonth() === new Date().getMonth() &&
                  selectedMonth.getFullYear() === new Date().getFullYear();
              
              const currentMonthNumber = selectedMonth.getMonth() + 1;
              const isHoliday = day ? getHoliday(day, currentMonthNumber) : false;
              const isLeaveDay = day && randomLeaveDays.includes(day);

              return (
                <View
                  key={index}
                  style={[
                    styles.calendarDay,
                    isToday && styles.todayDay,
                    isHoliday && styles.holidayDay,
                    isLeaveDay && styles.leaveDay, // Apply leave day style
                  ]}
                >
                  {day ? (
                    <Text
                      style={[
                        styles.dayText,
                        isToday ? styles.todayText : null,
                        isHoliday && styles.holidayText,
                        isLeaveDay && styles.leaveText, // Apply leave text style
                      ]}
                    >
                      {day}
                    </Text>
                  ) : null}
                </View>
              );
            })}
          </View>
        </View>

        {/* Upcoming Missions Section */}
        <View style={styles.missionsSection}>
          <Text style={styles.sectionTitle}>Upcoming Missions</Text>

          <View style={styles.missionsGrid}>
            {missions.map((mission, index) => {
              const [d, m] = mission.date.split('/').map(Number);
              const holidayName = getHoliday(d, m); // Use the corrected getHoliday

              return (
                <Animated.View key={mission.id} entering={FadeInDown.delay(index * 100).duration(500)} style={[styles.missionCard, holidayName ? styles.restDayCard : null]}>
                  {holidayName ? (
                    <View>
                      <View style={styles.missionHeaderRow}>
                        <View style={styles.missionIdSection}>
                          <Text style={[styles.missionId, { color: '#FF4D4D' }]}>DUTY OFF</Text>
                          <Text style={styles.missionType}>Rest Day / Gazetted Holiday</Text>
                        </View>
                        <View style={[styles.statusBadge, { borderColor: '#FF4D4D' }]}>
                          <MaterialCommunityIcons name="home-heart" size={16} color="#FF4D4D" />
                          <Text style={[styles.statusText, { color: '#FF4D4D' }]}>Relaxing</Text>
                        </View>
                      </View>
                      
                      <View style={styles.missionRoute}>
                        <MaterialCommunityIcons name="palm-tree" size={18} color="#FF4D4D" />
                        <Text style={[styles.routeText, { color: '#F1F5F9' }]}>
                          Holiday: {holidayName}
                        </Text>
                      </View>

                      <View style={styles.missionDetails}>
                        <View style={styles.detailItem}>
                          <MaterialCommunityIcons name="calendar-star" size={16} color="#FF4D4D" />
                          <Text style={styles.detailText}>{mission.date}</Text>
                        </View>
                        <View style={styles.detailItem}>
                          <MaterialCommunityIcons name="timer-off-outline" size={16} color="#FF4D4D" />
                          <Text style={styles.detailText}>No Flying Scheduled</Text>
                        </View>
                      </View>
                    </View>
                  ) : (
                    <View>
                      <View style={styles.missionHeaderRow}>
                        <View style={styles.missionIdSection}>
                          <Text style={styles.missionId}>{mission.id}</Text>
                          <Text style={styles.missionType}>{mission.type}</Text>
                        </View>
                        <View
                          style={[
                            styles.statusBadge,
                            { borderColor: getStatusColor(mission.status) },
                          ]}
                        >
                          <MaterialCommunityIcons
                            name={getStatusIcon(mission.status)}
                            size={16}
                            color={getStatusColor(mission.status)}
                          />
                          <Text style={[styles.statusText, { color: getStatusColor(mission.status) }]}>
                            {mission.status.charAt(0).toUpperCase() + mission.status.slice(1)}
                          </Text>
                        </View>
                      </View>

                      <View style={styles.missionRoute}>
                        <MaterialCommunityIcons name="map-marker" size={18} color="#38BDF8" />
                        <Text style={styles.routeText}>
                          {mission.origin} → {mission.destination}
                        </Text>
                      </View>

                      <View style={styles.missionDetails}>
                        <View style={styles.detailItem}>
                          <MaterialCommunityIcons name="calendar" size={16} color="#38BDF8" />
                          <Text style={styles.detailText}>{mission.date}</Text>
                        </View>
                        <View style={styles.detailItem}>
                          <MaterialCommunityIcons name="clock-outline" size={16} color="#38BDF8" />
                          <Text style={styles.detailText}>{mission.time}</Text>
                        </View>
                      </View>

                      <View style={styles.cargoSection}>
                        <View style={styles.cargoItem}>
                          <MaterialCommunityIcons name="package-variant" size={16} color="#38BDF8" />
                          <Text style={styles.cargoType}>{mission.cargo}</Text>
                        </View>
                        <View style={styles.weightBadge}>
                          <MaterialCommunityIcons name="weight" size={14} color="#ffffff" />
                          <Text style={styles.weightText}>{mission.weight}</Text>
                        </View>
                      </View>

                      <TouchableOpacity style={styles.detailsButton}>
                        <Text style={styles.detailsButtonText}>View Details</Text>
                        <MaterialCommunityIcons name="chevron-right" size={16} color="#0a0f1a" />
                      </TouchableOpacity>
                    </View>
                  )}
                </Animated.View>
              );
            })}
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
  dayText: {
    fontSize: 12,
    color: '#94A3B8',
    fontWeight: '500',
  },
  todayText: {
    color: '#00D084',
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
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#38BDF8',
    marginBottom: 20,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
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
    gap: 6,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
  },
  missionRoute: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    gap: 8,
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
    gap: 15,
    marginBottom: 12,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flex: 1,
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
