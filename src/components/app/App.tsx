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
	const [currentArticleState, setArticleState] =
		useState<ArticleStateType>(defaultArticleState);

	return (
		<div
			className={clsx(styles.main)}
			style={
				{
					'--font-family': currentArticleState.fontFamilyOption.value,
					'--font-size': currentArticleState.fontSizeOption.value,
					'--font-color': currentArticleState.fontColor.value,
					'--container-width': currentArticleState.contentWidth.value,
					'--bg-color': currentArticleState.backgroundColor.value,
				} as CSSProperties
			}>
			<ArticleParamsForm
				currentArticleState={currentArticleState}
				setArticleState={setArticleState}
			/>
			<Article />
		</div>
	);
};
