import supabase from './supabase'

export const db = {
  // Events
  async getEvents() {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .order('created_at', { ascending: false })
    return { data, error }
  },

  async createEvent(event: any) {
    const { data, error } = await supabase
      .from('events')
      .insert([event])
      .select()
    return { data, error }
  },

  async updateEvent(id: string, updates: any) {
    const { data, error } = await supabase
      .from('events')
      .update(updates)
      .eq('id', id)
      .select()
    return { data, error }
  },

  async deleteEvent(id: string) {
    const { error } = await supabase
      .from('events')
      .delete()
      .eq('id', id)
    return { error }
  },

  // Pet Doctors
  async getDoctors() {
    const { data, error } = await supabase
      .from('pet_doctors')
      .select('*')
      .order('rating', { ascending: false })
    return { data, error }
  },

  // Pet Trainers
  async getTrainers() {
    const { data, error } = await supabase
      .from('pet_trainers')
      .select('*')
      .order('rating', { ascending: false })
    return { data, error }
  },

  // Pet Shops
  async getShops() {
    const { data, error } = await supabase
      .from('pet_shops')
      .select('*')
      .order('rating', { ascending: false })
    return { data, error }
  },

  // Messages
  async sendMessage(message: any) {
    const { data, error } = await supabase
      .from('messages')
      .insert([message])
      .select()
    return { data, error }
  },

  async getMessages(senderId: string, receiverId: string) {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .or(`and(sender_id.eq.${senderId},receiver_id.eq.${receiverId}),and(sender_id.eq.${receiverId},receiver_id.eq.${senderId})`)
      .order('created_at', { ascending: true })
    return { data, error }
  },

  // Pet Profiles
  async createPetProfile(profile: any) {
    const { data, error } = await supabase
      .from('pet_profiles')
      .insert([profile])
      .select()
    return { data, error }
  },

  async getPetProfiles(ownerId?: string) {
    let query = supabase.from('pet_profiles').select('*')
    if (ownerId) {
      query = query.eq('owner_id', ownerId)
    } else {
      query = query.eq('is_public', true)
    }
    const { data, error } = await query.order('created_at', { ascending: false })
    return { data, error }
  },

  async updatePetProfile(id: string, updates: any) {
    const { data, error } = await supabase
      .from('pet_profiles')
      .update(updates)
      .eq('id', id)
      .select()
    return { data, error }
  },

  // Pet Posts
  async createPetPost(post: any) {
    const { data, error } = await supabase
      .from('pet_posts')
      .insert([post])
      .select()
    return { data, error }
  },

  async getPetPosts(petId?: string) {
    let query = supabase.from('pet_posts').select('*')
    if (petId) {
      query = query.eq('pet_id', petId)
    }
    const { data, error } = await query.order('created_at', { ascending: false })
    return { data, error }
  },

  async updatePetPost(id: string, updates: any) {
    const { data, error } = await supabase
      .from('pet_posts')
      .update(updates)
      .eq('id', id)
      .select()
    return { data, error }
  },

  async deletePetPost(id: string) {
    const { error } = await supabase
      .from('pet_posts')
      .delete()
      .eq('id', id)
    return { error }
  },

  // Lost & Found
  async createLostFoundPost(post: any) {
    const { data, error } = await supabase
      .from('lost_found_posts')
      .insert([post])
      .select()
    return { data, error }
  },

  async getLostFoundPosts() {
    const { data, error } = await supabase
      .from('lost_found_posts')
      .select('*')
      .eq('status', 'active')
      .order('created_at', { ascending: false })
    return { data, error }
  },

  async updateLostFoundPost(id: string, updates: any) {
    const { data, error } = await supabase
      .from('lost_found_posts')
      .update(updates)
      .eq('id', id)
      .select()
    return { data, error }
  },

  async deleteLostFoundPost(id: string) {
    const { error } = await supabase
      .from('lost_found_posts')
      .delete()
      .eq('id', id)
    return { error }
  },

  // Abuse Reports
  async createAbuseReport(report: any) {
    const { data, error } = await supabase
      .from('abuse_reports')
      .insert([report])
      .select()
    return { data, error }
  },

  async getAbuseReports(userId?: string) {
    let query = supabase.from('abuse_reports').select('*')
    if (userId) {
      query = query.eq('reporter_id', userId)
    }
    const { data, error } = await query.order('created_at', { ascending: false })
    return { data, error }
  },

  // Campaigns
  async getCampaigns() {
    const { data, error } = await supabase
      .from('campaigns')
      .select('*')
      .eq('status', 'active')
      .order('created_at', { ascending: false })
    return { data, error }
  },

  async createCampaign(campaign: any) {
    const { data, error } = await supabase
      .from('campaigns')
      .insert([campaign])
      .select()
    return { data, error }
  },

  async updateCampaign(id: string, updates: any) {
    const { data, error } = await supabase
      .from('campaigns')
      .update(updates)
      .eq('id', id)
      .select()
    return { data, error }
  },

  // Communities
  async getCommunities() {
    const { data, error } = await supabase
      .from('communities')
      .select('*')
      .order('created_at', { ascending: false })
    return { data, error }
  },

  async createCommunity(community: any) {
    const { data, error } = await supabase
      .from('communities')
      .insert([community])
      .select()
    return { data, error }
  },

  // Wildlife
  async getWildlifeSanctuaries() {
    const { data, error } = await supabase
      .from('wildlife_sanctuaries')
      .select('*')
      .order('created_at', { ascending: false })
    return { data, error }
  },

  async getWildlifePosts() {
    const { data, error } = await supabase
      .from('wildlife_posts')
      .select('*')
      .order('created_at', { ascending: false })
    return { data, error }
  },

  async createWildlifePost(post: any) {
    const { data, error } = await supabase
      .from('wildlife_posts')
      .insert([post])
      .select()
    return { data, error }
  },

  // Pet Caretakers
  async getCaretakers() {
    const { data, error } = await supabase
      .from('pet_caretakers')
      .select('*')
      .order('rating', { ascending: false })
    return { data, error }
  },

  // User Preferences (using profiles table)
  async updateUserPreferences(userId: string, preferences: any) {
    const { data, error } = await supabase
      .from('profiles')
      .update(preferences)
      .eq('id', userId)
      .select()
    return { data, error }
  },

  async getUserPreferences(userId: string) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()
    return { data, error }
  }
}

export default db