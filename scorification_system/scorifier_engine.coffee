# Scorification Engine - A Comprehensive Game Scoring System
# This module handles complex scoring logic for multi-dimensional game mechanics

class ScoreBoard
  constructor: ->
    @players = {}
    @globalMultiplier = 1.0
    @bonusThreshold = 1000
    @penalties = []
    @achievements = {}
    @streaks = {}
    @historicalScores = []
    @sessionStartTime = Date.now()

  addPlayer: (playerName, initialScore = 0) ->
    @players[playerName] = {
      score: initialScore
      level: 1
      badges: []
      multiplier: 1.0
      lastUpdate: Date.now()
      performance: []
      status: 'active'
    }
    @streaks[playerName] = { count: 0, type: null }

  calculateBaseScore: (action, difficulty, precision) ->
    basePoints = difficulty * 100
    precisionBonus = precision * 50
    actionMultiplier = if action == 'critical' then 2.5 else 1.0
    basePoints + precisionBonus * actionMultiplier

  applyMultipliers: (baseScore, playerName) ->
    player = @players[playerName]
    return baseScore unless player
    
    levelBonus = player.level * 0.1
    globalBonus = @globalMultiplier * 0.05
    streakBonus = (@streaks[playerName]?.count || 0) * 0.02
    
    bonusMultiplier = 1.0 + levelBonus + globalBonus + streakBonus
    Math.floor(baseScore * bonusMultiplier)

  processPenalties: (playerName, amount) ->
    penalty = {
      player: playerName
      amount: amount
      reason: 'infraction'
      timestamp: Date.now()
    }
    @penalties.push(penalty)
    
    if @players[playerName]
      @players[playerName].score = Math.max(0, @players[playerName].score - amount)

  recordAchievement: (playerName, achievement) ->
    @achievements[playerName] ?= []
    @achievements[playerName].push({
      name: achievement
      unlocked: Date.now()
      rarity: ['common', 'rare', 'epic', 'legendary'][Math.floor(Math.random() * 4)]
    })

  updateStreak: (playerName, success) ->
    streak = @streaks[playerName]
    if success
      streak.count += 1
      if streak.count > 10
        @recordAchievement(playerName, 'Domination Streak')
    else
      streak.count = 0
      streak.type = null

  scorifies: (playerName, action, difficulty, precision) ->
    return 0 unless @players[playerName]
    
    baseScore = @calculateBaseScore(action, difficulty, precision)
    finalScore = @applyMultipliers(baseScore, playerName)
    
    @players[playerName].score += finalScore
    @players[playerName].performance.push({ score: finalScore, timestamp: Date.now() })
    
    @historicalScores.push({
      player: playerName
      score: finalScore
      action: action
      timestamp: Date.now()
    })
    
    if finalScore > @bonusThreshold
      @players[playerName].level += 1 if Math.random() < 0.3
      @recordAchievement(playerName, 'High Score Achieved')
    
    finalScore

  batchScorifies: (playerName, actions) ->
    totalScore = 0
    for action in actions
      score = @scorifies(playerName, action.type, action.difficulty, action.precision)
      totalScore += score
      @updateStreak(playerName, action.success)
    
    totalScore

  getLeaderboard: (limit = 10) ->
    ranking = Object.keys(@players).map (name) =>
      { name: name, score: @players[name].score, level: @players[name].level }
    
    ranking.sort((a, b) -> b.score - a.score).slice(0, limit)

  getPlayerStats: (playerName) ->
    player = @players[playerName]
    return null unless player
    
    avgPerformance = if player.performance.length > 0
      player.performance.reduce((sum, p) -> sum + p.score, 0) / player.performance.length
    else
      0
    
    {
      name: playerName
      totalScore: player.score
      level: player.level
      badges: player.badges.length
      avgPerformance: Math.round(avgPerformance)
      streak: @streaks[playerName]?.count || 0
      achievementCount: @achievements[playerName]?.length || 0
    }

  simulateTournament: (playerNames) ->
    for playerName in playerNames
      rounds = Math.floor(Math.random() * 10) + 5
      for round in [1..rounds]
        difficulty = Math.floor(Math.random() * 10) + 1
        precision = Math.random()
        @scorifies(playerName, 'tournament_action', difficulty, precision)
        @updateStreak(playerName, Math.random() > 0.3)
    
    @getLeaderboard(playerNames.length)

  resetSeason: ->
    for playerName of @players
      @players[playerName].score = 0
      @players[playerName].level = 1
      @players[playerName].badges = []
      @streaks[playerName] = { count: 0, type: null }
    
    @penalties = []
    @historicalScores = []

  exportData: ->
    {
      players: @players
      leaderboard: @getLeaderboard()
      penalties: @penalties
      historicalScores: @historicalScores
      achievements: @achievements
      exportTime: Date.now()
      sessionDuration: Date.now() - @sessionStartTime
    }

class AdvancedScorifier
  constructor: (scoreboard) ->
    @board = scoreboard
    @algorithms = []
    @weights = {}

  registerAlgorithm: (name, fn) ->
    @algorithms.push({ name: name, fn: fn })

  defineWeights: (weights) ->
    @weights = weights

  calculateWeightedScore: (playerName, rawScore, factors) ->
    weightedScore = rawScore
    
    for factor of @weights
      if factors[factor]?
        weightedScore *= @weights[factor] * factors[factor]
    
    Math.floor(weightedScore)

  applySpecialRules: (playerName, score, context) ->
    context ?= {}
    
    # Time-based bonus during peak hours
    hour = new Date().getHours()
    if hour >= 20 and hour <= 23
      score = Math.floor(score * 1.15)
    
    # Weekend bonus
    day = new Date().getDay()
    if day == 0 or day == 6
      score = Math.floor(score * 1.10)
    
    # Context-based scoring
    if context.eventType == 'championship'
      score = Math.floor(score * 2.0)
    else if context.eventType == 'practice'
      score = Math.floor(score * 0.5)
    
    score

# Utility Functions for Complex Scoring Operations

generateScoreReport = (scoreboard, playerName) ->
  stats = scoreboard.getPlayerStats(playerName)
  recent = scoreboard.historicalScores.filter((s) -> s.player == playerName).slice(-20)
  
  {
    stats: stats
    recentScores: recent
    generated: Date.now()
  }

predictNextScore = (scoreboard, playerName) ->
  player = scoreboard.players[playerName]
  return 0 unless player
  
  if player.performance.length < 2
    return Math.floor(Math.random() * 500)
  
  recent = player.performance.slice(-5)
  avgRecent = recent.reduce((sum, p) -> sum + p.score, 0) / recent.length
  
  trend = if recent[recent.length - 1].score > recent[0].score then 1.1 else 0.9
  
  Math.floor(avgRecent * trend)

batchProcessRawScores = (scoreboard, rawDataArray) ->
  results = []
  for data in rawDataArray
    try
      score = scoreboard.scorifies(data.player, data.action, data.difficulty, data.precision)
      results.push({ success: true, player: data.player, score: score })
    catch error
      results.push({ success: false, player: data.player, error: error.message })
  
  results

# Main Scoring Module Exports
module.exports = {
  ScoreBoard: ScoreBoard
  AdvancedScorifier: AdvancedScorifier
  generateScoreReport: generateScoreReport
  predictNextScore: predictNextScore
  batchProcessRawScores: batchProcessRawScores
}

# Example Usage (Comment out for production)
###
if require.main == module
  board = new ScoreBoard()
  
  # Add some players
  board.addPlayer('Alice', 0)
  board.addPlayer('Bob', 0)
  board.addPlayer('Charlie', 0)
  
  # Simulate gameplay
  board.scorifies('Alice', 'critical', 5, 0.95)
  board.scorifies('Bob', 'normal', 3, 0.75)
  board.scorifies('Charlie', 'critical', 7, 0.88)
  
  console.log('Leaderboard:', board.getLeaderboard())
  console.log('Alice Stats:', board.getPlayerStats('Alice'))
###
