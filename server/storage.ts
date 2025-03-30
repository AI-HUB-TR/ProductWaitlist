import { users, type User, type InsertUser, 
  type WaitlistEntry, type InsertWaitlistEntry, 
  type Contact, type InsertContact } from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";
import { Store } from "express-session";

const MemoryStore = createMemoryStore(session);

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  // Kullanıcı işlemleri
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Bekleme listesi işlemleri
  addToWaitlist(entry: InsertWaitlistEntry): Promise<WaitlistEntry>;
  getWaitlistEntries(): Promise<WaitlistEntry[]>;
  
  // İletişim formu işlemleri
  saveContactForm(contact: InsertContact): Promise<Contact>;
  getContactForms(): Promise<Contact[]>;
  
  // Oturum yönetimi
  sessionStore: Store;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private waitlist: Map<number, WaitlistEntry>;
  private contacts: Map<number, Contact>;
  sessionStore: Store;
  
  // ID'ler için sayaçlar
  private userIdCounter: number;
  private waitlistIdCounter: number;
  private contactIdCounter: number;

  constructor() {
    this.users = new Map();
    this.waitlist = new Map();
    this.contacts = new Map();
    this.userIdCounter = 1;
    this.waitlistIdCounter = 1;
    this.contactIdCounter = 1;
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000 // 24 saat
    });
  }

  // Kullanıcı işlemleri
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  
  // Bekleme listesi işlemleri
  async addToWaitlist(entry: InsertWaitlistEntry): Promise<WaitlistEntry> {
    const id = this.waitlistIdCounter++;
    const now = new Date();
    
    // InsertWaitlistEntry'den WaitlistEntry'ye dönüştürme
    const waitlistEntry: WaitlistEntry = { 
      id,
      fullName: entry.fullName,
      email: entry.email,
      phone: entry.phone || null,
      age: entry.age || null,
      submittedAt: now
    };
    
    this.waitlist.set(id, waitlistEntry);
    return waitlistEntry;
  }
  
  async getWaitlistEntries(): Promise<WaitlistEntry[]> {
    return Array.from(this.waitlist.values());
  }
  
  // İletişim formu işlemleri
  async saveContactForm(contact: InsertContact): Promise<Contact> {
    const id = this.contactIdCounter++;
    const now = new Date();
    
    // InsertContact'tan Contact'a dönüştürme
    const contactEntry: Contact = {
      id,
      name: contact.name,
      email: contact.email,
      subject: contact.subject,
      message: contact.message,
      submittedAt: now
    };
    
    this.contacts.set(id, contactEntry);
    return contactEntry;
  }
  
  async getContactForms(): Promise<Contact[]> {
    return Array.from(this.contacts.values());
  }
}

export const storage = new MemStorage();
