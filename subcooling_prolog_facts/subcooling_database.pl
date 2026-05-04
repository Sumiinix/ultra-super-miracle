% Subcooling Thermal Analysis Database in Prolog
% A comprehensive knowledge base for refrigeration and cooling systems

% Define thermodynamic properties for various refrigerants
refrigerant(r134a, carbon_based, synthetic, 'Tetrafluoroethane').
refrigerant(r404a, azeotrope, synthetic, 'HFC Blend').
refrigerant(r410a, azeotrope, synthetic, 'HFC Blend').
refrigerant(ammonia, inorganic, natural, 'NH3').
refrigerant(co2, inorganic, natural, 'CO2').
refrigerant(propane, hydrocarbon, natural, 'C3H8').
refrigerant(isobutane, hydrocarbon, natural, 'C4H10').

% Subcooling degree thresholds for different applications
subcooling_range(low, 0, 5).
subcooling_range(moderate, 5, 15).
subcooling_range(high, 15, 30).
subcooling_range(very_high, 30, 100).

% Cooling system types and their characteristics
cooling_system(air_conditioning, building_comfort, 20, 25).
cooling_system(refrigeration, food_storage, 5, 10).
cooling_system(industrial_chiller, process_cooling, 10, 15).
cooling_system(cryogenic, ultra_low_temp, 50, 100).
cooling_system(heat_pump, heating_cooling, 8, 12).

% Temperature conversion predicates
celsius_to_fahrenheit(C, F) :- F is (C * 9/5) + 32.
fahrenheit_to_celsius(F, C) :- C is (F - 32) * 5/9.
celsius_to_kelvin(C, K) :- K is C + 273.15.
kelvin_to_celsius(K, C) :- C is K - 273.15.

% Subcooling calculation based on saturation temperature
calculate_subcooling(SatTemp, LiquidTemp, Subcooling) :-
    Subcooling is SatTemp - LiquidTemp.

% Component specifications
compressor(single_stage, fixed_displacement, 2.5, 0.85).
compressor(single_stage, variable_displacement, 3.5, 0.88).
compressor(two_stage, fixed_displacement, 4.0, 0.82).
compressor(two_stage, variable_displacement, 5.0, 0.90).
compressor(scroll, fixed_displacement, 3.0, 0.87).
compressor(rotary, fixed_displacement, 2.8, 0.84).

condenser(air_cooled, aluminum, 25, 45).
condenser(water_cooled, copper, 30, 50).
condenser(microchannel, aluminum, 35, 55).
condenser(brazed_plate, copper, 40, 60).

evaporator(plate_fin, aluminum, 15, 35).
evaporator(tube_fin, copper, 12, 30).
evaporator(microchannel, aluminum, 20, 40).
evaporator(direct_expansion, copper, 10, 25).

% Expansion device specifications
expansion_device(capillary_tube, fixed, 0.5, 2.0).
expansion_device(thermostatic_valve, variable, 1.0, 5.0).
expansion_device(electronic_valve, variable, 0.8, 8.0).
expansion_device(orifice_plate, fixed, 0.3, 1.5).

% Pressure-temperature relationships for refrigerants
% pt_curve(Refrigerant, Temperature, Pressure)
pt_curve(r134a, -40, 3.5).
pt_curve(r134a, -30, 5.2).
pt_curve(r134a, -20, 7.5).
pt_curve(r134a, -10, 10.5).
pt_curve(r134a, 0, 14.5).
pt_curve(r134a, 10, 19.5).
pt_curve(r134a, 20, 25.8).
pt_curve(r134a, 30, 33.5).
pt_curve(r134a, 40, 42.8).
pt_curve(r134a, 50, 53.8).

pt_curve(r410a, -40, 5.1).
pt_curve(r410a, -30, 7.8).
pt_curve(r410a, -20, 11.2).
pt_curve(r410a, -10, 15.8).
pt_curve(r410a, 0, 21.8).
pt_curve(r410a, 10, 29.5).
pt_curve(r410a, 20, 39.0).
pt_curve(r410a, 30, 50.5).
pt_curve(r410a, 40, 64.2).
pt_curve(r410a, 50, 80.5).

pt_curve(ammonia, -40, 1.2).
pt_curve(ammonia, -30, 1.9).
pt_curve(ammonia, -20, 3.0).
pt_curve(ammonia, -10, 4.5).
pt_curve(ammonia, 0, 6.6).
pt_curve(ammonia, 10, 9.5).
pt_curve(ammonia, 20, 13.2).
pt_curve(ammonia, 30, 17.9).
pt_curve(ammonia, 40, 24.0).
pt_curve(ammonia, 50, 31.8).

% Efficiency ratings for different components
efficiency_rating(compressor, high, 0.85, 0.95).
efficiency_rating(compressor, medium, 0.75, 0.85).
efficiency_rating(compressor, low, 0.65, 0.75).

efficiency_rating(condenser, high, 0.80, 0.95).
efficiency_rating(condenser, medium, 0.70, 0.80).
efficiency_rating(condenser, low, 0.60, 0.70).

efficiency_rating(evaporator, high, 0.75, 0.90).
efficiency_rating(evaporator, medium, 0.65, 0.75).
efficiency_rating(evaporator, low, 0.55, 0.65).

% Subcooling effectiveness predicates
effective_subcooling(System, Degree) :-
    Degree >= 5,
    Degree =< 20.

inadequate_subcooling(Degree) :-
    Degree < 5.

excessive_subcooling(Degree) :-
    Degree > 25.

% Component compatibility
compatible_system(Refrigerant, Compressor, Condenser, Evaporator, Expansion) :-
    refrigerant(Refrigerant, _, _, _),
    compressor(Compressor, _, _, _),
    condenser(Condenser, _, _, _),
    evaporator(Evaporator, _, _, _),
    expansion_device(Expansion, _, _, _).

% Thermodynamic cycle analysis
cycle_analysis(Refrigerant, CompressorType, CondenserType, EvaporatorType, ExpansionType, Subcooling, COP) :-
    refrigerant(Refrigerant, _, _, _),
    compressor(CompressorType, _, _, CompressorEff),
    condenser(CondenserType, _, _, _),
    evaporator(EvaporatorType, _, _, _),
    expansion_device(ExpansionType, _, _, _),
    effective_subcooling(system, Subcooling),
    COP is (CompressorEff * Subcooling) / 100.

% Fault detection based on subcooling levels
diagnose_subcooling(TooLow) :-
    TooLow < 2,
    write('Critical: Liquid line restriction or low charge detected').

diagnose_subcooling(Low) :-
    Low >= 2,
    Low < 5,
    write('Warning: Possible undercharge or expansion valve issue').

diagnose_subcooling(Normal) :-
    Normal >= 5,
    Normal =< 15,
    write('OK: Subcooling within normal range').

diagnose_subcooling(High) :-
    High > 15,
    High =< 25,
    write('Info: Higher than typical subcooling, check system settings').

diagnose_subcooling(VeryHigh) :-
    VeryHigh > 25,
    write('Alert: Excessive subcooling, may indicate condenser oversizing').

% Oil management in refrigeration systems
oil_type(mineral, standard_refrigerants, -10, 60).
oil_type(alkylbenzene, hfc_refrigerants, -15, 65).
oil_type(ester, hfc_and_hfo_refrigerants, -20, 70).
oil_type(pao, natural_refrigerants, -25, 75).

% Piping and line sizing
line_sizing(liquid_line, small_system, 3, 8, 3.0).
line_sizing(liquid_line, medium_system, 8, 15, 4.5).
line_sizing(liquid_line, large_system, 15, 30, 6.0).

line_sizing(suction_line, small_system, 3, 8, 6.0).
line_sizing(suction_line, medium_system, 8, 15, 9.5).
line_sizing(suction_line, large_system, 15, 30, 12.0).

% Heat transfer calculations
heat_transfer_rate(Area, LMTD, UA, HeatRate) :-
    HeatRate is Area * LMTD * UA.

logarithmic_mean_temp_diff(T1_in, T1_out, T2_in, T2_out, LMTD) :-
    DeltaT1 is T1_in - T2_out,
    DeltaT2 is T1_out - T2_in,
    DeltaT1 > 0,
    DeltaT2 > 0,
    (DeltaT1 =:= DeltaT2 ->
        LMTD is DeltaT1
    ;
        LMTD is (DeltaT1 - DeltaT2) / log(DeltaT1 / DeltaT2)
    ).

% System optimization rules
optimize_subcooling(Refrigerant, Subcooling, Recommendation) :-
    refrigerant(Refrigerant, _, _, _),
    Subcooling < 5,
    Recommendation = 'increase_expansion_device_opening'.

optimize_subcooling(Refrigerant, Subcooling, Recommendation) :-
    refrigerant(Refrigerant, _, _, _),
    Subcooling > 25,
    Recommendation = 'decrease_expansion_device_opening'.

optimize_subcooling(Refrigerant, Subcooling, Recommendation) :-
    refrigerant(Refrigerant, _, _, _),
    Subcooling >= 5,
    Subcooling =< 25,
    Recommendation = 'system_operating_normally'.

% System load calculations
load_calculation(design_load, comfort_cooling, 10).
load_calculation(design_load, food_storage, 5).
load_calculation(design_load, industrial_process, 15).

load_calculation(peak_load, comfort_cooling, 25).
load_calculation(peak_load, food_storage, 12).
load_calculation(peak_load, industrial_process, 35).

% Maintenance and service intervals
maintenance_schedule(compressor, hours_2000, oil_analysis).
maintenance_schedule(compressor, hours_5000, filter_replacement).
maintenance_schedule(compressor, hours_10000, major_service).

maintenance_schedule(condenser, months_6, cleaning).
maintenance_schedule(condenser, months_12, inspection).

maintenance_schedule(evaporator, months_6, cleaning).
maintenance_schedule(evaporator, months_12, inspection).

% Environmental impact factors
gwp_value(r134a, 1430).
gwp_value(r404a, 3920).
gwp_value(r410a, 2088).
gwp_value(ammonia, 0).
gwp_value(co2, 1).
gwp_value(propane, 3).
gwp_value(isobutane, 3).

ozone_depletion_potential(r134a, 0.0).
ozone_depletion_potential(r404a, 0.0).
ozone_depletion_potential(r410a, 0.0).
ozone_depletion_potential(ammonia, 0.0).

% System performance metrics
performance_metric(cop, coefficient_of_performance, higher_is_better).
performance_metric(eer, energy_efficiency_ratio, higher_is_better).
performance_metric(seer, seasonal_energy_efficiency_ratio, higher_is_better).
performance_metric(hspf, heating_season_performance_factor, higher_is_better).

% Subcooling measurement techniques
measurement_technique(infrared, non_contact, accurate, expensive).
measurement_technique(thermocouple, contact, accurate, moderate).
measurement_technique(thermistor, contact, good, inexpensive).
measurement_technique(rtd, contact, very_accurate, expensive).

% Safety considerations
safety_requirement(pressure_relief, mandatory, compressor_protection).
safety_requirement(moisture_control, mandatory, system_reliability).
safety_requirement(overcharge_protection, recommended, efficiency_optimization).
safety_requirement(subcooling_monitoring, recommended, performance_tracking).

% Data logging and monitoring
data_point(timestamp, datetime, recorded).
data_point(compressor_discharge, temperature, real_time).
data_point(compressor_suction, temperature, real_time).
data_point(condenser_outlet, temperature, real_time).
data_point(evaporator_inlet, temperature, real_time).
data_point(high_side_pressure, pressure, real_time).
data_point(low_side_pressure, pressure, real_time).
data_point(outdoor_temperature, ambient, periodic).
data_point(indoor_temperature, ambient, periodic).
data_point(system_runtime, hours, accumulated).
data_point(energy_consumption, kwh, accumulated).

% Predictive maintenance indicators
indicator(liquid_line_temp_stable, good_condition).
indicator(subcooling_consistent, good_condition).
indicator(high_pressure_stable, good_condition).
indicator(low_pressure_stable, good_condition).
indicator(rising_discharge_temp, potential_issue).
indicator(decreasing_suction_pressure, potential_issue).
indicator(increasing_liquid_line_temp, potential_issue).
indicator(erratic_subcooling, potential_issue).

% Additional thermodynamic property data
% Specific heat values in kJ/kg·K
specific_heat(r134a, liquid, 1.02).
specific_heat(r134a, vapor, 0.75).
specific_heat(r410a, liquid, 1.09).
specific_heat(r410a, vapor, 0.72).
specific_heat(ammonia, liquid, 4.42).
specific_heat(ammonia, vapor, 1.67).

% Density values in kg/m³
density(r134a, liquid, 1207).
density(r134a, vapor, 7.5).
density(r410a, liquid, 1265).
density(r410a, vapor, 8.2).
density(ammonia, liquid, 682).
density(ammonia, vapor, 0.73).

% Viscosity values in µP·s
viscosity(r134a, liquid, 254).
viscosity(r134a, vapor, 120).
viscosity(r410a, liquid, 165).
viscosity(r410a, vapor, 125).
viscosity(ammonia, liquid, 282).
viscosity(ammonia, vapor, 95).

% Latent heat values in kJ/kg
latent_heat(r134a, 215.9).
latent_heat(r410a, 200.0).
latent_heat(ammonia, 1369.0).

% Critical temperature values in °C
critical_temperature(r134a, 101.06).
critical_temperature(r410a, 70.18).
critical_temperature(ammonia, 132.25).

% Critical pressure values in bar
critical_pressure(r134a, 40.59).
critical_pressure(r410a, 49.12).
critical_pressure(ammonia, 113.33).

% Subcooling impact on system efficiency
subcooling_efficiency_impact(efficiency_loss, 0.5) :-
    inadequate_subcooling(3).

subcooling_efficiency_impact(efficiency_optimal, 1.0) :-
    effective_subcooling(system, 10).

subcooling_efficiency_impact(efficiency_loss, 0.8) :-
    excessive_subcooling(30).

% Complex system interaction rules
system_performance(Efficiency, COP_Rating, Reliability) :-
    Efficiency > 85,
    COP_Rating > 3.5,
    Reliability = high.

system_performance(Efficiency, COP_Rating, Reliability) :-
    Efficiency > 75,
    Efficiency =< 85,
    COP_Rating > 3.0,
    Reliability = medium.

system_performance(Efficiency, COP_Rating, Reliability) :-
    Efficiency =< 75,
    COP_Rating =< 3.0,
    Reliability = low.

% Expert system rules for troubleshooting
troubleshoot(high_pressure, possible_causes([condenser_fouling, overcharge, noncondensable_gases])).
troubleshoot(low_pressure, possible_causes([undercharge, restriction, expansion_valve_malfunction])).
troubleshoot(low_subcooling, possible_causes([low_charge, expansion_valve_stuck_open, liquid_line_restriction])).
troubleshoot(high_subcooling, possible_causes([high_charge, condenser_oversized, expansion_valve_stuck_closed])).

% Integration points for external systems
external_integration(scada, real_time_monitoring).
external_integration(building_management, system_control).
external_integration(iot_sensors, data_collection).
external_integration(cloud_analytics, predictive_maintenance).

% End of subcooling database
