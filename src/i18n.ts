export const I18nFr: I18nInterface = {
    saveBtn: 'Enregistrer',
    cancelBtn: 'Annuler',

    loadImage: 'Charger une image depuis votre PC',
    loadImageUrl: 'Charger une image depuis une URL',
    loading: 'Chargement',
    loadError: 'Erreur de chargement %@',
    removeImage: 'Supprimer l\'image',

    sizes: {
        small: 'Petit',
        medium: 'Moyen',
        large: 'Gros'
    },

    undo: 'Annuler',
    redo: 'Répter',
    clear: 'Effacer',

    colors: {
        black: 'Noir',
        white: 'Blanc',
        yellow: 'Jaune',
        red: 'Rouge',
        green: 'Vert',
        blue: 'Blue',
        purple: 'Violet'
    },

    tools: {
        brush: 'Pinceau'
    }
};

export const I18nEn: I18nInterface = {
    saveBtn: 'Save',
    cancelBtn: 'Cancel',

    loadImage: 'Load image',
    loadImageUrl: 'Load image from URL',
    loading: 'Loading',
    loadError: 'Error loading %@',
    removeImage: 'Remove image',

    sizes: {
        small: 'Small',
        medium: 'Medium',
        large: 'Large'
    },

    undo: 'Undo',
    redo: 'Redo',
    clear: 'Clear',

    colors: {
        black: 'Black',
        white: 'White',
        yellow: 'Yellow',
        red: 'Red',
        green: 'Green',
        blue: 'Blue',
        purple: 'Purple',
    },

    tools: {
        brush: 'Brush'
    }
};

export const i18nLanguages: { [name: string]: I18nInterface } = {
    fr: I18nFr,
    en: I18nEn
};

export interface I18nInterface {
    saveBtn?: string;
    cancelBtn?: string;

    loadImage?: string;
    loadImageUrl?: string;
    loading?: string;
    loadError?: string;
    removeImage?: string;

    sizes?: { [name: string]: string };

    undo?: string;
    redo?: string;
    clear?: string;

    colors?: { [name: string]: string };

    tools?: { [name: string]: string };
}
