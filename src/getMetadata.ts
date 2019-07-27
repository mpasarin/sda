import * as azdev from 'azure-devops-node-api';
import * as bi from 'azure-devops-node-api/interfaces/BuildInterfaces';
import * as GitInterfaces from 'azure-devops-node-api/interfaces/GitInterfaces';
import { List } from 'lodash';
import { IMyResult } from './interfaces/IConfig';

const API_TOKEN: string = 'jfj3bcakxdp5uvor4fneuum4tvcbe2lrjiwxrhgyy63e4amlowva';

export default async function getMetadata(buildDefpath: string, repo: string, branchName: string) {
    const project = buildDefpath.split('_build?')[0];
    const buildDef =  buildDefpath.split('_build?')[1].split('definitionId=')[1];

    const server = repo.split('/_git/')[0];
    const repository = repo.split('/_git/')[1];

    const builds: bi.Build[] = await getBuild(project, buildDef).then((response) => response.value);
    printBuildDetails(builds[0], server);

    if (branchName !== 'master') {
        // tslint:disable-next-line:max-line-length
        const prs: GitInterfaces.GitPullRequest[] = await getPullRequests(project, repository, branchName).then((response) => response.value);
        prDetails(prs, server);
    }
}

function findPrs(prs: GitInterfaces.GitPullRequest[], branchName: string): GitInterfaces.GitPullRequest[] {
    const branchPrs: GitInterfaces.GitPullRequest[] = [];
    prs.forEach((element) => {
        if (element.sourceRefName !== undefined && element.sourceRefName.includes(branchName)) {
            branchPrs.push(element);
        }
    });
    return branchPrs;
}

function formBuildLink(serverUrl: string, buildId: number | undefined) {
    if (!buildId) {
        return 'url is not available as build id cannot be retrieved';
    }
    return `${serverUrl}/_build/results?buildId=${buildId}`;
}

function formPRLink(serverUrl: string, prId: number | undefined) {
    if (!prId) {
        return 'url is not available as pull request id cannot be retrieved';
    }
    return `${serverUrl}/_git/sp-client/pullrequest/${prId}`;
}

function printBuildDetails(build: bi.Build, serverUrl: string) {
    console.log(`Last completed build: `);
    const url: string = formBuildLink(serverUrl, build.id);
    console.log(`\turl: ${url}`);
    console.log(`\tstatus: ${build.result}`);
}

function prDetails(prArray: GitInterfaces.GitPullRequest[], serverUrl: string) {
    prArray.forEach((element) => {
        console.log(`Pull Requests:`);
        const url: string = formPRLink(serverUrl, element.pullRequestId);
        console.log(`\turl: ${url}`);
        console.log(`\tstatus:${element.status}`);
        const reviewersString = element.reviewers!.map((r) => `\n\t${r.displayName} - ${getVoteString(r.vote)}`);
        console.log(`\treviews:${reviewersString}`);
    });
}

function getVoteString(vote: number | undefined) {
    if (vote === 10) { return 'Approved'; }
    if (vote === 5) { return 'Approved with suggestions'; }
    if (vote === 0) { return 'No vote'; }
    if (vote === -5) { return 'Waiting for author'; }
    if (vote === -10) { return 'Rejected'; }
    return 'No vote';
}

export async function getBuild(project: string, buildDef: string): Promise<IMyResult<bi.Build>> {
    return new Promise<IMyResult<bi.Build>>(async (resolve, reject) => {
        try {
            const vsts: azdev.WebApi = await getApi(project);
            // tslint:disable-next-line:max-line-length
            const buildRes = await vsts.rest.get(`${project}_apis/build/builds?definitions=${buildDef}&statusFilter=completed&$top=5`);
            if (buildRes.statusCode >= 200 && buildRes.statusCode <= 299) {
                const result: IMyResult<bi.Build> = buildRes.result as IMyResult<bi.Build>;
                resolve(result);
            } else {
                console.error('API to get the last completed build failed');
            }
        } catch (error) {
            reject(error);
        }
    });
}

// tslint:disable-next-line:max-line-length
export async function getPullRequests(project: string, repo: string, branchName: string): Promise<IMyResult<GitInterfaces.GitPullRequest>> {
    return new Promise<IMyResult<GitInterfaces.GitPullRequest>>(async (resolve, reject) => {
        try {
            const vsts: azdev.WebApi = await getApi(project);
            // tslint:disable-next-line:max-line-length
            const prApiRes = await vsts.rest.get(`${project}_apis/git/pullrequests?searchCriteria.sourceRepositoryId=${repo}&searchCriteria.RefName=${branchName}&$top=1`);
            if (prApiRes.statusCode >= 200 && prApiRes.statusCode <= 299) {
                // tslint:disable-next-line:max-line-length
                const result: IMyResult<GitInterfaces.GitPullRequest> = prApiRes.result as IMyResult<GitInterfaces.GitPullRequest>;
                resolve(result);
            } else {
                console.error('Get Pull Requests API failed');
            }
        } catch (error) {
            reject(error);
        }
    });
}

export async function getApi(serverUrl: string): Promise<azdev.WebApi> {
    return new Promise<azdev.WebApi>(async (resolve, reject) => {
        try {
            const authHandler = azdev.getPersonalAccessTokenHandler(API_TOKEN);
            const option = undefined;
            const vsts: azdev.WebApi = new azdev.WebApi(serverUrl, authHandler, option);
            resolve(vsts);
        } catch (err) {
            reject(err);
        }
    });
}
