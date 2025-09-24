export interface NotionRichText {
    type: 'text'
    text: {
        content: string
        link?: {
            url: string
        } | null
    }
    annotations: {
        bold: boolean
        italic: boolean
        strikethrough: boolean
        underline: boolean
        code: boolean
        color: string
    }
    plain_text: string
    href?: string | null
}

export interface NotionTitle {
    type: 'title'
    title: NotionRichText[]
}

export interface NotionRichTextProperty {
    type: 'rich_text'
    rich_text: NotionRichText[]
}

export interface NotionCheckbox {
    type: 'checkbox'
    checkbox: boolean
}

export interface NotionRichTextProperty {
    type: 'rich_text'
    rich_text: NotionRichText[]
}

export interface NotionDatabaseProperties {
    Title: NotionTitle
    Message: NotionRichTextProperty
    Public: NotionCheckbox
}

export interface NotionPage {
    object: 'page'
    id: string
    created_time: string
    last_edited_time: string
    created_by: {
        object: 'user'
        id: string
    }
    last_edited_by: {
        object: 'user'
        id: string
    }
    cover: never
    icon: never
    parent: {
        type: 'database_id'
        database_id: string
    }
    archived: boolean
    properties: NotionDatabaseProperties
    url: string
    public_url?: string | null
}

export interface NotionQueryResponse {
    object: 'list'
    results: NotionPage[]
    next_cursor: string | null
    has_more: boolean
    type: 'page_or_database'
    page_or_database: object
}

// these types are not currently being used but they might be useful someday ?

export interface NotionNumber {
    type: 'number'
    number: number | null
}

export interface NotionCreatedTime {
    type: 'created_time'
    created_time: string
}