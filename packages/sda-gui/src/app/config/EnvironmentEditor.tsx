import { Dropdown, TextField } from 'office-ui-fabric-react';
import * as React from 'react';
import { INamed } from 'sda/lib/interfaces';
import { IConfig, IConfigEnvironment } from 'sda/lib/interfaces/IConfig';

interface IEnvironmentEditorProps {
    env: Partial<INamed<IConfigEnvironment>>;
    setEnv: (env: Partial<INamed<IConfigEnvironment>>) => void;
    isNew: boolean;
    config: IConfig;
}

export default (props: IEnvironmentEditorProps) => {
    const env = props.env;
    return <div>
        <TextField
            label='Environment id'
            disabled={!props.isNew}
            defaultValue={env.id}
            onChange={(ev, value) => {
                props.setEnv({ ...env, id: value });
            }}
        />
        <Dropdown
            label='Template id'
            options={getTemplateDowndropOptions(props.config)}
            defaultSelectedKey={props.env.templateId}
            onChange={(ev, option) => {
                const templateId = option ? option.key as string : undefined;
                props.setEnv({ ...env, templateId });
            }}
        />
        <TextField
            label='Root folder path'
            defaultValue={env.path}
            onChange={(ev, value) => {
                props.setEnv({ ...env, path: value });
            }}
        />
    </div>;
};

function getTemplateDowndropOptions(config: IConfig) {
    return Object.keys(config.templates).map((templateId) => {
        return {
            key: templateId,
            text: templateId
        };
    });
}
