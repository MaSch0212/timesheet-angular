module.exports = {
    name: 'time-sheet',
    preset: '../../jest.config.js',
    coverageDirectory: '../../coverage/apps/time-sheet/',
    snapshotSerializers: [
        'jest-preset-angular/AngularSnapshotSerializer.js',
        'jest-preset-angular/HTMLCommentSerializer.js'
    ]
};
