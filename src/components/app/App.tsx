import { useState, CSSProperties } from 'react';
import { Article } from 'src/components/article';
import { ArticleParamsForm } from 'src/components/article-params-form';
import {
	defaultArticleState,
	ArticleStateType,
} from 'src/constants/articleProps';
import clsx from 'clsx';

import styles from 'src/styles/index.module.scss';

/* Настройки устанавливаются через CSS-переменные, которые уже есть в стилях
и установлены в коде в дефолтные значения.*/

export const App = () => {
	const [appState, setAppState] =
		useState<ArticleStateType>(defaultArticleState);

	return (
		<div
			className={clsx(styles.main)}
			style={
				{
					'--font-family': appState.fontFamilyOption.value,
					'--font-size': appState.fontSizeOption.value,
					'--font-color': appState.fontColor.value,
					'--container-width': appState.contentWidth.value,
					'--bg-color': appState.backgroundColor.value,
				} as CSSProperties
			}>
			<ArticleParamsForm currentState={appState} setAppState={setAppState} />
			<Article />
		</div>
	);
};
