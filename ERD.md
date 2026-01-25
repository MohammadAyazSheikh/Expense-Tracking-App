# HisaabBee Entity Relationship Diagram (ERD)

This document outlines the normalized database schema for the HisaabBee application.

## Legend

- **PK**: Primary Key
- **FK**: Foreign Key
- **1..1**: One-to-One
- **1..N**: One-to-Many
- **N..N**: Many-to-Many

```mermaid
erDiagram
    %% Auth & User Module
    User {
        uuid id PK
        string email
        string name
        string avatar_url
        string role "admin, user"
        string device_token
        datetime created_at
        datetime updated_at
    }

    AppSettings {
        uuid user_id PK, FK
        string theme "light, dark, system"
        string locale
        boolean is_rtl
        boolean notifications_enabled
        datetime updated_at
    }

    Notification {
        uuid id PK
        uuid user_id FK
        string type
        string title
        string text
        boolean is_read
        string action_link
        datetime created_at
    }

    %% Finance Module
    Wallet {
        uuid id PK
        uuid user_id FK
        string name
        string type "Cash, Bank, Card"
        decimal balance
        string currency
        string color
        string icon
        string account_number
        string last4_digits
        boolean is_default
        boolean include_in_total
    }

    SystemCategory {
        uuid id PK
        string name
        string icon
        string icon_family
        string color
        string type "income, expense"
        boolean is_active
    }

    Category {
        uuid id PK
        uuid user_id FK
        uuid system_category_id FK "Nullable, if copied from system"
        string name
        string icon
        string icon_family
        string color
        string type "income, expense"
    }

    Tag {
        uuid id PK
        uuid user_id FK
        string name
        string color
    }

    Transaction {
        uuid id PK
        uuid wallet_id FK
        uuid category_id FK
        uuid transfer_to_wallet_id FK "Nullable, for transfers"
        decimal amount
        string type "income, expense, transfer"
        date date
        time time
        string note
        string location
        string payment_method
        boolean is_recurring
        datetime created_at
    }

    TransactionTags {
        uuid transaction_id PK, FK
        uuid tag_id PK, FK
    }

    Budget {
        uuid id PK
        uuid user_id FK
        uuid category_id FK
        decimal limit_amount
        string period "monthly, weekly, yearly"
        string color
    }

    %% Social Module
    Group {
        uuid id PK
        uuid created_by_user_id FK
        string name
        string avatar_url
        datetime created_at
    }

    GroupMember {
        uuid group_id PK, FK
        uuid user_id PK, FK
        decimal balance "Cached balance in group"
        datetime joined_at
    }

    GroupExpense {
        uuid id PK
        uuid group_id FK
        uuid paid_by_user_id FK
        decimal amount
        string description
        date date
        string split_type "equal, exact, percentage"
        datetime created_at
    }

    ExpenseSplit {
        uuid expense_id PK, FK
        uuid user_id PK, FK
        decimal amount_owed
        decimal percentage "If split_type is percentage"
    }

    Settlement {
        uuid id PK
        uuid group_id FK
        uuid payer_user_id FK
        uuid payee_user_id FK
        decimal amount
        string status "pending, completed"
        date date
    }

    %% Relationships

    User ||--|| AppSettings : "has settings"
    User ||--o{ Notification : "receives"
    User ||--o{ Wallet : "owns"
    User ||--o{ Category : "manages"
    SystemCategory ||--o{ Category : "serves as template for"
    User ||--o{ Tag : "creates"
    User ||--o{ Transaction : "makes (via Wallet)"
    User ||--o{ Budget : "sets"
    User ||--o{ Group : "creates"
    User ||--o{ GroupMember : "is member of"
    User ||--o{ GroupExpense : "pays"
    User ||--o{ ExpenseSplit : "owes in"
    User ||--o{ Settlement : "participates in"

    Wallet ||--o{ Transaction : "records"
    Wallet ||--o{ Transaction : "receives transfer"

    Category ||--o{ Transaction : "categorizes"
    Category ||--o{ Budget : "is tracked by"

    Transaction ||--o{ TransactionTags : "is tagged with"
    Tag ||--o{ TransactionTags : "tags"

    Group ||--o{ GroupMember : "has members"
    Group ||--o{ GroupExpense : "tracks expenses"
    Group ||--o{ Settlement : "facilitates settlements"

    GroupExpense ||--o{ ExpenseSplit : "is split into"

```

## Module Details

### 1. Authentication & User Profile

- **User**: Core entity. Stores authentication credentials (hashed), profile info, and role (admin or user).
- **AppSettings**: 1:1 relationship with User. Stores device-specific or account-wide preferences like theme and language.
- **Notification**: History of alerts sent to the user.

### 2. Personal Finance Management

- **Wallet**: Represents a source of funds (Bank Account, Cash, Credit Card). 'include_in_total' flag determines if it counts towards net worth.
- **SystemCategory**: Immutable master list of default categories provided by the platform.
- **Category**: User-specific category list. Users can create custom categories or copy from `SystemCategory`. Once copied, they can modify the name/color/icon independently.
- **Tag**: orthogonal classification for transactions (e.g., #trip, #urgent).
- **Transaction**: The central event entity. Links Wallet and Category.
  - Includes `transfer_to_wallet_id` to handle internal transfers (double-entry bookkeeping logic simplified).
- **TransactionTags**: Many-to-Many link between Transactions and Tags.
- **Budget**: Set limits per Category for a specific period.

### 3. Social Finance (Split Bill)

- **Group**: A collection of users sharing expenses.
- **GroupMember**: Linking table for Users in Groups. Caches the 'balance' (net owe/owed) for performance.
- **GroupExpense**: A bill paid by one member on behalf of the group.
- **ExpenseSplit**: Detail of how a GroupExpense is divided among members.
- **Settlement**: A payment transaction between members to settle debts within a group context.

## Normalization Notes

- **Category**: Separated from Transaction. `SystemCategory` acts as a catalog. User `Category` table acts as the mutable list for user's transactions.
- **Tags**: Many-to-Many relationship allows for flexible tagging without duplicating data.
- **Splits**: `ExpenseSplit` is a separate table rather than a JSON array (unlike the current frontend store) to query "how much does User X owe in total" efficiently using SQL aggregates.
- **Users**: In the frontend `Friend` model, friends might be ad-hoc. In this normalized schema, we assume they are mapped to `Users`. If "Shadow Users" (non-registered friends) are needed, a `is_registered` flag on the User table or a separate `GuestUser` table linked to the creator would be added.
