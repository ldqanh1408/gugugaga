from transformers import AutoModelForSequenceClassification, AutoTokenizer
import torch
import numpy as np
import logging

logger = logging.getLogger(__name__)

# Cache for models to prevent reloading
_sentiment_model = None
_sentiment_tokenizer = None

# Check if CUDA is available
CUDA_AVAILABLE = torch.cuda.is_available()

def _get_sentiment_model_and_tokenizer():
    """Lazy initialization of sentiment model and tokenizer"""
    global _sentiment_model, _sentiment_tokenizer
    
    if _sentiment_model is None or _sentiment_tokenizer is None:
        try:
            model_name = "cardiffnlp/twitter-roberta-base-sentiment-latest"
            logger.info(f"Loading sentiment model: {model_name}")
            
            _sentiment_tokenizer = AutoTokenizer.from_pretrained(model_name)
            _sentiment_model = AutoModelForSequenceClassification.from_pretrained(model_name)
            
            # Move model to GPU if available
            if CUDA_AVAILABLE:
                _sentiment_model = _sentiment_model.to("cuda")
                logger.info("Sentiment model loaded on GPU")
            else:
                logger.info("Sentiment model loaded on CPU")
                
        except Exception as e:
            logger.error(f"Error loading sentiment model: {str(e)}")
            raise
            
    return _sentiment_model, _sentiment_tokenizer

def analyze_sentiment(text: str) -> dict:
    """
    Analyze sentiment of input text using RoBERTa model
    
    Args:
        text: Input text to analyze
        
    Returns:
        Dictionary with sentiment score and label
    """
    try:
        if not text or not text.strip():
            return {"score": 0.5, "label": "neutral"}
            
        model, tokenizer = _get_sentiment_model_and_tokenizer()
        
        # Prepare input
        inputs = tokenizer(text, return_tensors="pt", truncation=True, max_length=512)
        if CUDA_AVAILABLE:
            inputs = {k: v.to("cuda") for k, v in inputs.items()}
            
        # Get prediction
        with torch.no_grad():
            outputs = model(**inputs)
            
        # Process outputs
        scores = torch.softmax(outputs.logits, dim=1).cpu().numpy()[0]
        
        # Model outputs 3 classes: negative (0), neutral (1), and positive (2)
        # Convert to a single sentiment score from 0 to 1 where:
        # - 0 is very negative
        # - 0.5 is neutral
        # - 1 is very positive
        sentiment_score = scores[2] * 0.5 + 0.5 - scores[0] * 0.5
        
        # Get the sentiment label
        label_id = np.argmax(scores)
        labels = ["negative", "neutral", "positive"]
        sentiment_label = labels[label_id]
        
        return {
            "score": float(sentiment_score),
            "raw_scores": scores.tolist(),
            "label": sentiment_label
        }
        
    except Exception as e:
        logger.error(f"Error analyzing sentiment: {str(e)}")
        return {"score": 0.5, "label": "neutral", "error": str(e)}