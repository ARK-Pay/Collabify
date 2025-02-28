erDiagram

    USER ||--o{ PROJECT : creates

    USER ||--o{ PROJECT_USER : belongs_to

    USER {

        int id PK

        string name

        string email

        string password_hash

        string registration_otp

        string reset_otp

        datetime created_at

        datetime last_login

    }



    ADMIN ||--o{ PROJECT_APPROVAL : approves

    ADMIN {

        int admin_id PK

        string name

        string email

        string password_hash

        datetime created_at

        datetime last_login

    }

   

    PROJECT ||--o{ PROJECT_USER : has

    PROJECT ||--o{ PROJECT_APPROVAL : requires_approval

    PROJECT {

        int id PK

        string name

        text description

        datetime created_at

        datetime updated_at

        datetime deadline

        int creator_id FK

        boolean is_approved

    }



    PROJECT_APPROVAL {

        int approval_id PK

        int project_id FK

        int admin_id FK

        datetime approval_date

        string status

    }



    PROJECT_USER {

        int id PK

        int project_id FK

        int user_id FK

        datetime joined_at

    }

   

    PROJECT ||--o{ TASK : contains

    TASK {

        int id PK

        int project_id FK

        string title

        text description

        datetime deadline

        string status

        int creator_id FK

        int assignee_id FK

        datetime created_at

        datetime updated_at

    }

   

    TASK ||--o{ TASK_HISTORY : has

    TASK_HISTORY {

        int history_id PK

        int task_id FK

        int user_id FK

        string action

        text old_value

        text new_value

        datetime action_time

    }



    TASK ||--o{ COMMENT : has

    COMMENT {

        int comment_id PK

        int project_id FK

        int creator_id FK

        text content

        string file_name

        string file_path

        int file_size

        string file_type

        datetime created_at

        datetime updated_at

    }



   

    PROJECT ||--o{ PROJECT_STATISTIC : has

    PROJECT_STATISTIC {

        int statistic_id PK

        int project_id FK

        int total_tasks

        int completed_tasks

        int overdue_tasks

        float completion_percentage

        datetime last_updated

    }



    PROJECT ||--o{ PROJECT_TAG : has

    PROJECT_TAG {

        int project_tag_id PK

        int project_id FK

        int tag_id FK

        string tag_name

        string tag_description

        datetime tagged_at

    }

